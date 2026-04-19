using BuenosFrizados.Application.Services;
using BuenosFrizados.Infrastructure.Data;
using BuenosFrizados.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using FluentValidation;
using FluentValidation.AspNetCore;
using BuenosFrizados.API.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database configuration - support both SQL Server and PostgreSQL
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
var connectionString = databaseUrl ?? builder.Configuration.GetConnectionString("DefaultConnection");

// Log connection details for debugging
Console.WriteLine($"=== DATABASE CONFIGURATION DEBUG ===");
Console.WriteLine($"Environment: {builder.Environment.EnvironmentName}");
Console.WriteLine($"DATABASE_URL variable: {(string.IsNullOrEmpty(databaseUrl) ? "NOT SET" : "SET")}");
if (!string.IsNullOrEmpty(databaseUrl))
{
    Console.WriteLine($"DATABASE_URL starts with postgres://: {databaseUrl.StartsWith("postgres://")}");
    Console.WriteLine($"DATABASE_URL (first 20 chars): {databaseUrl.Substring(0, Math.Min(20, databaseUrl.Length))}...");
}
Console.WriteLine($"Final connection string starts with postgres://: {connectionString?.StartsWith("postgres://") == true}");
Console.WriteLine($"All Environment Variables:");
foreach (DictionaryEntry env in Environment.GetEnvironmentVariables())
{
    var key = env.Key.ToString();
    if (key.Contains("DATABASE") || key.Contains("POSTGRES") || key.Contains("DB"))
    {
        Console.WriteLine($"  {key}: {env.Value}");
    }
}
Console.WriteLine($"=== END DEBUG ===");

builder.Services.AddDbContext<BuenosFrizadosDbContext>(options =>
{
    if (!string.IsNullOrEmpty(databaseUrl) && databaseUrl.StartsWith("postgres://"))
    {
        try
        {
            // Railway PostgreSQL connection string format
            Console.WriteLine("Using PostgreSQL for Railway deployment");
            var databaseUri = new Uri(databaseUrl);
            var userInfo = databaseUri.UserInfo.Split(':');
            
            if (userInfo.Length != 2)
            {
                throw new InvalidOperationException("Invalid DATABASE_URL format - missing username or password");
            }
            
            var connectionStringBuilder = $"Host={databaseUri.Host};" +
                                        $"Port={databaseUri.Port};" +
                                        $"Database={databaseUri.LocalPath.Trim('/')};" +
                                        $"Username={userInfo[0]};" +
                                        $"Password={userInfo[1]};" +
                                        "SSL Mode=Require;Trust Server Certificate=true";
            Console.WriteLine($"PostgreSQL connection string: {connectionStringBuilder.Replace(userInfo[1], "***")}");
            options.UseNpgsql(connectionStringBuilder);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error parsing DATABASE_URL: {ex.Message}");
            Console.WriteLine("Falling back to SQL Server configuration");
            options.UseSqlServer(connectionString);
        }
    }
    else
    {
        // Local SQL Server
        Console.WriteLine("Using SQL Server for local development");
        Console.WriteLine($"SQL Server connection string: {connectionString?.Replace("Password=BuenosFrizados123!", "Password=***")}");
        options.UseSqlServer(connectionString);
    }
});

builder.Services.AddScoped<ProductRepository>();
builder.Services.AddScoped<OrderRepository>();
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<OrderService>();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        }
        else
        {
            // Production - allow Railway frontend and local testing
            policy.WithOrigins(
                    "http://localhost:5173",
                    "https://buenosfrizados-production.up.railway.app"
                  )
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        }
    });
});

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors("AllowFrontend");

app.UseAuthorization();
app.MapControllers();

// Ensure database is created and migrated in production
if (!app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<BuenosFrizadosDbContext>();
    try
    {
        context.Database.Migrate();
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database");
    }
}

app.Run();
