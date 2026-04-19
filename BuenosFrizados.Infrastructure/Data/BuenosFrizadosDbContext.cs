using BuenosFrizados.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BuenosFrizados.Infrastructure.Data;

public class BuenosFrizadosDbContext : DbContext {
    public BuenosFrizadosDbContext(DbContextOptions<BuenosFrizadosDbContext> options) : base(options) { }

    public DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure for PostgreSQL compatibility
        modelBuilder.Entity<Product>(entity =>
        {
            entity.Property(e => e.Name).HasColumnType("varchar(255)");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.ImageUrl).HasColumnType("varchar(500)");
            entity.Property(e => e.Price).HasPrecision(18, 2);
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.Property(e => e.ClientPhoneNumber).HasColumnType("varchar(50)");
            entity.Property(e => e.TotalAmount).HasPrecision(18, 2);
            entity.Property(e => e.OrderDate).HasColumnType("timestamp with time zone");
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.Property(e => e.ProductName).HasColumnType("varchar(255)");
            entity.Property(e => e.UnitPrice).HasPrecision(18, 2);
        });
    }
}
