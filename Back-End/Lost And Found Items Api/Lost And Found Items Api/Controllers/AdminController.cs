using Lost_And_Found_Items_Api.Data_Logic;
using Lost_And_Found_Items_Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Lost_And_Found_Items_Api.Controllers
{
    [Route("api/Admins")]
    [ApiController]
    public class AdminsController : ControllerBase
    {
        private readonly AdminService _service;

        public AdminsController(AdminService service)
        {
            _service = service;
        }

        // POST: api/Admins/Login
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (loginDto == null ||
                string.IsNullOrWhiteSpace(loginDto.UserName) ||
                string.IsNullOrWhiteSpace(loginDto.Password))
            {
                return BadRequest(new { message = "Username and password are required." });
            }

            // Use your existing service method
            var admin = await _service.VerifyLoginAsync(loginDto.UserName, loginDto.Password);

            if (admin == null)
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }

            // Login successful
            return Ok(new
            {
                message = "Login successful",
                adminId = admin.Id,
                userName = admin.Username,
                isAdmin = true
            });
        }

        // GET: api/Admins
        [HttpGet("GetAllAdmins")]
        public async Task<IActionResult> GetAll()
        {
            var admins = await _service.GetAllAsync();
            
            return Ok(admins);
        }

        // GET: api/Admins/GetAdminById/5
        [HttpGet("GetAdminById/{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var admin = await _service.GetByIdAsync(id);
            if (admin == null)
                return NotFound(new { message = $"Admin with ID {id} was not found." });

            return Ok(admin);
        }

        // POST: api/Admins/CreateNewAdmin
        [HttpPost("CreateNewAdmin")]
        public async Task<IActionResult> Create(Admin admin)
        {
            if (admin == null)
                return BadRequest(new { message = "Admin body cannot be null." });

            var created = await _service.AddAsync(admin);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }

        // PUT: api/Admins/UpdateAdminById/5
        [HttpPut("UpdateAdminById/{id}")]
        public async Task<IActionResult> Update(int id, Admin admin)
        {
            if (admin == null)
                return BadRequest(new { message = "Admin cannot be null." });

            if (id != admin.Id)
                return BadRequest(new { message = "ID mismatch between URL and body." });

            var updated = await _service.UpdateAsync(admin);
            if (updated == null)
                return NotFound(new { message = $"Admin with ID {id} not found." });

            return Ok(updated);
        }

        // DELETE: api/Admins/DeleteAdminById/5
        [HttpDelete("DeleteAdminById/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var admin = await _service.GetByIdAsync(id);
            if (admin == null)
                return NotFound(new { message = $"Admin with ID {id} was not found." });

            await _service.DeleteAsync(admin);
            return NoContent();
        }
    }
}
