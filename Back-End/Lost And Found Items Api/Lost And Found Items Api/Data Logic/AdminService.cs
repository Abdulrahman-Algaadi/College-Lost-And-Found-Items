using Lost_And_Found_Items_Api.Data_Access_Layer;
using Lost_And_Found_Items_Api.Models;

namespace Lost_And_Found_Items_Api.Data_Logic
{
    public class AdminService
    {
        private readonly AdminRepository _repo;
        public AdminService(AdminRepository repo) => _repo = repo;

        public async Task<Admin> AddAsync(Admin admin)
        {
            // Hash the password before saving
            admin.PasswordHash = PasswordHasher.HashPassword(admin.PasswordHash);
            return await _repo.AddAsync(admin);
        }

        public async Task<Admin> VerifyLoginAsync(string username, string password)
        {
            var admin = await _repo.GetByUsernameAsync(username);
            if (admin == null) return null;

            if (PasswordHasher.VerifyPassword(password, admin.PasswordHash))
                return admin;

            return null;
        }

        public async Task<List<Admin>> GetAllAsync() => await _repo.GetAllAsync();
        public async Task<Admin> GetByIdAsync(int id) => await _repo.GetByIdAsync(id);
        public async Task<Admin> UpdateAsync(Admin admin)
        {
            admin.PasswordHash = PasswordHasher.HashPassword(admin.PasswordHash);
            return await _repo.UpdateAsync(admin);
        }
        public async Task DeleteAsync(Admin admin) => await _repo.DeleteAsync(admin);
    }
}
