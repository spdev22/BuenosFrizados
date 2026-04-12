using BuenosFrizados.Domain.Entities;
using BuenosFrizados.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BuenosFrizados.Infrastructure.Repositories;

public class OrderRepository
{
    private readonly BuenosFrizadosDbContext _context;

    public OrderRepository(BuenosFrizadosDbContext context)
    {
        _context = context;
    }

    public async Task<List<Order>> GetAllAsync()
    {
        return await _context.Orders.Include(o => o.Items).OrderByDescending(p => p.OrderDate).ToListAsync();
    }

    public async Task<Order> GetByIdAsync(int id)
    {
        return await _context.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<Order> CreateAsync(Order order)
    {
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
        return order;
    }

    public async Task UpdateStateAsync(int id, OrderStatus newStatus)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order is null) return;
        order.Status = newStatus;
        await _context.SaveChangesAsync();
    }
    

}

