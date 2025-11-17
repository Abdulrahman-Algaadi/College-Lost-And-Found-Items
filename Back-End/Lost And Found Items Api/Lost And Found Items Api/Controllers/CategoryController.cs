using Lost_And_Found_Items_Api.Data_Logic;
using Lost_And_Found_Items_Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Lost_And_Found_Items_Api.Controllers
{
    [Route("api/Categories")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryService _service;

        public CategoryController(CategoryService service) => _service = service;

        // GET: api/Category/GetAllCategories
        [HttpGet("GetAllCategories")]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _service.GetAllAsync();
            return Ok(categories);
        }

        // GET: api/Category/GetCategoryByID/5
        [HttpGet("GetCategoryByID/{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var category = await _service.GetByIdAsync(id);
            if (category == null)
                return NotFound(new { message = $"Category with ID {id} not found." });

            return Ok(category);
        }

        // POST: api/Category/Create
        [HttpPost("Create")]
        public async Task<IActionResult> Create(Category category)
        {
            if (category == null)
                return BadRequest(new { message = "Category cannot be null." });

            var created = await _service.AddAsync(category);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }

        // PUT: api/Category/Update/5
        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Update(int id, Category category)
        {
            if (category == null)
                return BadRequest(new { message = "Category cannot be null." });

            if (id != category.Id)
                return BadRequest(new { message = "ID mismatch between URL and body." });

            var updated = await _service.UpdateAsync(category);
            if (updated == null)
                return NotFound(new { message = $"Category with ID {id} not found." });

            return Ok(updated);
        }

        // DELETE: api/Category/Delete/5
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _service.GetByIdAsync(id);
            if (category == null)
                return NotFound(new { message = $"Category with ID {id} not found." });

            await _service.DeleteAsync(category);
            return NoContent();
        }
    }
}
