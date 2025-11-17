using Lost_And_Found_Items_Api.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace Lost_And_Found_Items_Api.Data_Access_Layer
{
    public class AdminRepository
    {
        private readonly CollegeLostAndFoundContext _context;

        public object Admin { get; internal set; }

        public AdminRepository(CollegeLostAndFoundContext context) => _context = context;

        public async Task<List<Admin>> GetAllAsync() => await _context.Admins.ToListAsync();
        public async Task<Admin> GetByIdAsync(int id) => await _context.Admins.FindAsync(id);
        public async Task<Admin> AddAsync(Admin admin)
        {
            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();
            return admin;
        }
        public async Task<Admin?> UpdateAsync(Admin admin)
        {
            // Fetch the tracked entity first
            var existing = await _context.Admins.FindAsync(admin.Id);
            if (existing == null) return null;

            // Update only allowed fields
            existing.Username = admin.Username;
            existing.PasswordHash = admin.PasswordHash;

            await _context.SaveChangesAsync();
            return existing;
        }
        public async Task DeleteAsync(Admin admin)
        {
            _context.Admins.Remove(admin);
            await _context.SaveChangesAsync();
        }
        public async Task<Admin> GetByUsernameAsync(string username)
        {
            return await _context.Admins.FirstOrDefaultAsync(a => a.Username == username);
        }
    }
}
