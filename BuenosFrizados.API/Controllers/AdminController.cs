using Microsoft.AspNetCore.Mvc;

namespace BuenosFrizados.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AdminController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("validate")]
        public IActionResult ValidatePin([FromBody] AdminValidationRequest request)
        {
            if (request?.Pin == null)
            {
                return BadRequest(new { message = "PIN es requerido" });
            }

            var adminPin = _configuration["AdminPin"] ?? "1234";
            
            if (request.Pin == adminPin)
            {
                return Ok(new { success = true, message = "PIN válido" });
            }

            return Unauthorized(new { success = false, message = "PIN incorrecto" });
        }
    }

    public class AdminValidationRequest
    {
        public string Pin { get; set; } = string.Empty;
    }
}