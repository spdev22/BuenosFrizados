using BuenosFrizados.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BuenosFrizados.Infrastructure.Data;

public class BuenosFrizadosDbContext : DbContext {
    public BuenosFrizadosDbContext(DbContextOptions<BuenosFrizadosDbContext> options) : base(options) { }

    public DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

}
