using BuenosFrizados.Domain.Entities;
using BuenosFrizados.Infrastructure.Repositories;

namespace BuenosFrizados.Application.Services;

public class OrderService
{
      
    private readonly OrderRepository _repository;
    
    public OrderService(OrderRepository repository)
    {
       _repository = repository;
    }

    public async Task<List<Order>> GetAllOrdersAsync(int page = 1, int pageSize = 10)
    {
        return await _repository.GetAllAsync(page, pageSize);
    }

    public async Task<int> GetTotalOrdersCountAsync()
    {
        return await _repository.GetTotalCountAsync();
    }

    public async Task<Order> GetOrderByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<Order> CreateOrderAsync(Order order)
    {
      order.OrderDate = DateTime.UtcNow;
      return await _repository.CreateAsync(order);
    }

    public async Task ConfirmOrderAsync(int id)
    {
        await _repository.UpdateStateAsync(id, OrderStatus.Confirmed);
    }

    public async Task OrderDeliveredAsync(int id)
    {
        await _repository.UpdateStateAsync(id, OrderStatus.Delivered);
    }

     public async Task CancelOrderAsync(int id)
    {
        await _repository.UpdateStateAsync(id, OrderStatus.Cancelled);
    }
}
