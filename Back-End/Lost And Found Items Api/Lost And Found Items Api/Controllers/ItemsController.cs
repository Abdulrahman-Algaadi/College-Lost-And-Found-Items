using Lost_And_Found_Items_Api.Data_Logic;
using Lost_And_Found_Items_Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Lost_And_Found_Items_Api.Controllers
{
    [Route("api/items")]
    [ApiController]
    public class ItemsController : ControllerBase
    {
        private readonly ItemService _service;
        public ItemsController(ItemService service) => _service = service;

        // GET: api/Items/GetAllItems
        [HttpGet("GetAllItems")]
        public async Task<IActionResult> GetAll()
        {
            var items = await _service.GetAllAsync();
            if (items == null) 
                return NotFound(new { message = $"No Itmes Found ! " });

            return Ok(items);
        }

        // GET: api/Items/GetItemByID/{id}
        [HttpGet("GetItemByID/{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _service.GetByIdAsync(id);
            if (item == null)
                return NotFound(new { message = $"Item with ID {id} not found." });

            return Ok(item);
        }

        // POST: api/Items/CreateNewItem
        [HttpPost("CreateNewItem")]
        public async Task<IActionResult> Create(ItemCreateDto dto)
        {
            if (dto == null)
                return BadRequest(new { message = "Item cannot be null." });

            var item = new Item
            {
                Title = dto.Title,
                Description = dto.Description,
                PhotoUrl = dto.PhotoUrl,
                CategoryId = dto.CategoryId,
                StatusId = dto.StatusId,
                Location = dto.Location,
                ContactInfo = dto.ContactInfo,
                DateReported = dto.DateReported
            };
            // When it Comes To Post And Put We use DTO ...

            var created = await _service.AddAsync(item);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }


        // PUT: api/Items/UpdateItemByID/{id}
        [HttpPut("UpdateItemByID/{id}")]
       
        public async Task<IActionResult> Update(int id, [FromBody] ItemUpdateDto dto)
        {
            if (dto == null)
                return BadRequest(new { message = "Item cannot be null." });

            if (id != dto.Id)
                return BadRequest(new { message = "ID mismatch between URL and body." });

            var existing = await _service.GetByIdAsync(id);
            if (existing == null)
                return NotFound(new { message = $"Item with ID {id} not found." });

            // Update only editable fields
            existing.Title = dto.Title;
            existing.Description = dto.Description;
            existing.PhotoUrl = dto.PhotoUrl;
            existing.CategoryId = dto.CategoryId;
            existing.StatusId = dto.StatusId;
            existing.Location = dto.Location;
            existing.ContactInfo = dto.ContactInfo;
            existing.DateReported = dto.DateReported;
            existing.UserId = dto.UserId;

            var updated = await _service.UpdateAsync(existing);
            return Ok(updated);
        }

        // DELETE: api/Items/DeleteItemByID/{id}
        [HttpDelete("DeleteItemByID/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _service.GetByIdAsync(id);
            if (item == null)
                return NotFound(new { message = $"Item with ID {id} not found." });

            await _service.DeleteAsync(item);
            return NoContent();
        }
    }
}
