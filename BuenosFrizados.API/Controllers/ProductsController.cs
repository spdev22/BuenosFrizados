using BuenosFrizados.Application.Services;
using BuenosFrizados.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace BuenosFrizados.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ProductService _service;

    public ProductsController(ProductService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await _service.GetAllProductsAsync();
        return Ok(products);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Product product)
    {
        var created = await _service.CreateProductAsync(product);
        return CreatedAtAction(nameof(GetAll), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Product product)
    {
        product.Id = id;
        await _service.UpdateProductAsync(product);
        return NoContent();
    }
}
