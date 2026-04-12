using BuenosFrizados.Domain.Entities;
using BuenosFrizados.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BuenosFrizados.Infrastructure.Repositories;

public class ProductRepository
{
    private readonly BuenosFrizadosDbContext _context;

    public ProductRepository(BuenosFrizadosDbContext context)
    {
        _context = context;
    }

    public async Task<List<Product>> GetAllAsync()
    {
        return await _context.Products.Where(product => product.isActive).ToListAsync();
    }

    public async Task<Product> GetByIdAsync(int id)
    {
        return await _context.Products.FindAsync(id);
    }

    public async Task<Product> CreateAsync(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return product;
    }

    public async Task UpdateAsync(Product product)
    {
        _context.Products.Update(product);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteProductAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product != null)
        {
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
        }
    }
}
