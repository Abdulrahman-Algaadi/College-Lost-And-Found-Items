using Lost_And_Found_Items_Api.Data_Logic;
using Lost_And_Found_Items_Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Lost_And_Found_Items_Api.Controllers
{
    [Route("api/Statuses")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        private readonly StatusService _service;
        public StatusController(StatusService service) => _service = service;

        [HttpGet("GetAllItems")] public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());
        [HttpGet("GetStatusByID{id}", Name = "GetStatusByID")] public async Task<IActionResult> Get(int id) => Ok(await _service.GetByIdAsync(id));
        [HttpPost("CreateNewStatus")] public async Task<IActionResult> Create(Status status) => Ok(await _service.AddAsync(status));
        [HttpPut("{id}",Name ="Update")]
        public async Task<IActionResult> Update(int id, Status status)
        {
            if (id != status.Id) return BadRequest();
            return Ok(await _service.UpdateAsync(status));
        }
        [HttpDelete("DeleteStudentByID{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var status = await _service.GetByIdAsync(id);
            if (status == null) return NotFound();
            await _service.DeleteAsync(status);
            return NoContent();
        }
    }
}
