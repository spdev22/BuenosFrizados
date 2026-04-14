using BuenosFrizados.Domain.Entities;
using BuenosFrizados.Application.Services;
using BuenosFrizados.API.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace BuenosFrizados.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly OrderService _service;

    public OrdersController(OrderService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var orders = await _service.GetAllOrdersAsync();
        var response = orders.Select(o => new OrderResponse
        {
            Id = o.Id,
            ClientId = o.ClientId,
            ClientPhoneNumber = o.ClientPhoneNumber,
            OrderDate = o.OrderDate,
            Total = o.Total,
            Status = o.Status.ToString(),
            Items = o.Items.Select(i => new OrderItemResponse
            {
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice
            }).ToList()
        });
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await _service.GetOrderByIdAsync(id);
        if (order == null) return NotFound();
        return Ok(new OrderResponse
        {
            Id = order.Id,
            ClientId = order.ClientId,
            ClientPhoneNumber = order.ClientPhoneNumber,
            OrderDate = order.OrderDate,
            Total = order.Total,
            Status = order.Status.ToString(),
            Items = order.Items.Select(i => new OrderItemResponse
            {
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice
            }).ToList()
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateOrderRequest request)
    {
        var order = new Order
        {
            ClientId = request.ClientId,
            ClientPhoneNumber = request.ClientPhoneNumber,
            OrderDate = DateTime.UtcNow,
            Items = request.Items.Select(i => new OrderItem
            {
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice
            }).ToList()
        };
        var created = await _service.CreateOrderAsync(order);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, new OrderResponse
        {
            Id = created.Id,
            ClientId = created.ClientId,
            ClientPhoneNumber = created.ClientPhoneNumber,
            OrderDate = created.OrderDate,
            Total = created.Total,
            Status = created.Status.ToString(),
            Items = created.Items.Select(i => new OrderItemResponse
            {
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice
            }).ToList()
        });
    }

    [HttpPost("{id}/confirm")]
    public async Task<IActionResult> Confirm(int id)
    {
        await _service.ConfirmOrderAsync(id);
        return NoContent();
    }

    [HttpPost("{id}/deliver")]
    public async Task<IActionResult> Deliver(int id)
    {
        await _service.OrderDeliveredAsync(id);
        return NoContent();
    }

    [HttpPost("{id}/cancel")]
    public async Task<IActionResult> Cancel(int id)
    {
        await _service.CancelOrderAsync(id);
        return NoContent();
    }
}