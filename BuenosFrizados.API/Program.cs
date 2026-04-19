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
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL") ?? 
                      builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<BuenosFrizadosDbContext>(options =>
{
    if (connectionString?.StartsWith("postgres://") == true)
    {
        // Railway PostgreSQL connection string format
        var databaseUri = new Uri(connectionString);
        var userInfo = databaseUri.UserInfo.Split(':');
        var connectionStringBuilder = $"Host={databaseUri.Host};" +
                                    $"Port={databaseUri.Port};" +
                                    $"Database={databaseUri.LocalPath.Trim('/')};" +
                                    $"Username={userInfo[0]};" +
                                    $"Password={userInfo[1]};" +
                                    "SSL Mode=Require;Trust Server Certificate=true";
        options.UseNpgsql(connectionStringBuilder);
    }
    else
    {
        // Local SQL Server
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
