using BuenosFrizados.Application.Services;
using BuenosFrizados.Infrastructure.Data;
using BuenosFrizados.Infrastructure.Repositories;
using BuenosFrizados.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using FluentValidation;
using FluentValidation.AspNetCore;
using BuenosFrizados.API.Middleware;
using System.Collections;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database configuration - support both SQL Server and PostgreSQL
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
var pgHost = Environment.GetEnvironmentVariable("PGHOST");
var pgUser = Environment.GetEnvironmentVariable("PGUSER");
var pgPassword = Environment.GetEnvironmentVariable("PGPASSWORD");
var pgDatabase = Environment.GetEnvironmentVariable("PGDATABASE");
var pgPort = Environment.GetEnvironmentVariable("PGPORT");

Console.WriteLine($"=== DATABASE DEBUG (Railway PostgreSQL) ===");
Console.WriteLine($"Environment: {builder.Environment.EnvironmentName}");
Console.WriteLine($"DATABASE_URL: {(string.IsNullOrEmpty(databaseUrl) ? "NOT SET" : "SET")}");
if (!string.IsNullOrEmpty(databaseUrl))
{
    Console.WriteLine($"DATABASE_URL starts with 'postgres://': {databaseUrl.StartsWith("postgres://")}");
    Console.WriteLine($"DATABASE_URL starts with 'postgresql://': {databaseUrl.StartsWith("postgresql://")}");
    Console.WriteLine($"DATABASE_URL (first 50 chars): {databaseUrl.Substring(0, Math.Min(50, databaseUrl.Length))}...");
    
    // Parse and log database name
    try {
        var uri = new Uri(databaseUrl);
        Console.WriteLine($"Parsed database name: '{uri.LocalPath.Trim('/')}'");
        Console.WriteLine($"Parsed host: '{uri.Host}'");
        Console.WriteLine($"Parsed port: '{uri.Port}'");
    } catch (Exception ex) {
        Console.WriteLine($"Error parsing DATABASE_URL: {ex.Message}");
    }
}
Console.WriteLine($"PGHOST: {pgHost ?? "NOT SET"}");
Console.WriteLine($"PGUSER: {pgUser ?? "NOT SET"}"); 
Console.WriteLine($"PGDATABASE: {pgDatabase ?? "NOT SET"}");
Console.WriteLine($"PGPORT: {pgPort ?? "NOT SET"}");
Console.WriteLine($"=== END DEBUG ===");

string? connectionString = null;

// Try DATABASE_URL format FIRST (Railway uses this)
if (!string.IsNullOrEmpty(databaseUrl) && (databaseUrl.StartsWith("postgres://") || databaseUrl.StartsWith("postgresql://")))
{
    try
    {
        var databaseUri = new Uri(databaseUrl);
        var userInfo = databaseUri.UserInfo.Split(':');
        connectionString = $"Host={databaseUri.Host};Port={databaseUri.Port};Database={databaseUri.LocalPath.Trim('/')};Username={userInfo[0]};Password={userInfo[1]};SSL Mode=Require;Trust Server Certificate=true";
        Console.WriteLine("Using PostgreSQL with DATABASE_URL from Railway");
        Console.WriteLine($"Connecting to PostgreSQL on {databaseUri.Host}:{databaseUri.Port}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error parsing DATABASE_URL: {ex.Message}");
        connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        Console.WriteLine("Falling back to SQL Server");
    }
}
// Try separate PostgreSQL environment variables
else if (!string.IsNullOrEmpty(pgHost) && !string.IsNullOrEmpty(pgUser) && 
    !string.IsNullOrEmpty(pgPassword) && !string.IsNullOrEmpty(pgDatabase))
{
    connectionString = $"Host={pgHost};Port={pgPort ?? "5432"};Database={pgDatabase};Username={pgUser};Password={pgPassword};SSL Mode=Require;Trust Server Certificate=true";
    Console.WriteLine("Using PostgreSQL with separate environment variables");
}
else
{
    connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    Console.WriteLine("Using SQL Server for local development");
}

builder.Services.AddDbContext<BuenosFrizadosDbContext>(options =>
{
    if (connectionString != null && connectionString.Contains("Host="))
    {
        // PostgreSQL connection
        Console.WriteLine("Configuring PostgreSQL database");
        options.UseNpgsql(connectionString);
    }
    else
    {
        // SQL Server connection
        Console.WriteLine("Configuring SQL Server database");
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
            // Production - allow Vercel frontend, Railway frontend and local testing
            policy.WithOrigins(
                    "http://localhost:5173",
                    "https://buenosfrizados-production.up.railway.app",
                    "https://buenos-frizados.vercel.app"
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
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    
    try
    {
        // For PostgreSQL migration issues, recreate database
        if (connectionString != null && connectionString.Contains("Host="))
        {
            Console.WriteLine("PostgreSQL detected - recreating database schema");
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();
            
            // Add sample data
            if (!context.Products.Any())
            {
                context.Products.AddRange(
                    new Product { Name = "Empanadas (x12)", Description = "Deliciosas empanadas caseras", Price = 8500, ImageUrl = "https://example.com/empanadas.jpg", IsActive = true, Stock = 100 },
                    new Product { Name = "Bastones de Muzzarella", Description = "Ricos bastones hechos con la muzzarella mas rica de todas", Price = 4500, ImageUrl = "https://webdato.com/services/qr/desnivel/carta/wp-content/uploads/2023/04/bastoncitos-de-muzarrella.jpg", IsActive = true, Stock = 50 }
                );
                context.SaveChanges();
                Console.WriteLine("Sample data added to PostgreSQL database");
            }
        }
        else
        {
            context.Database.Migrate();
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while setting up the database");
    }
}

app.Run();
