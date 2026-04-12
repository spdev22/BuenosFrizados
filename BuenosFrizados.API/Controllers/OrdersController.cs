using BuenosFrizados.Domain.Entities;
using BuenosFrizados.Application.Services;
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
        return Ok(orders);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await _service.GetOrderByIdAsync(id);
        if (order == null) return NotFound();
        return Ok(order);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Order order)
    {
        var created = await _service.CreateOrderAsync(order);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
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
