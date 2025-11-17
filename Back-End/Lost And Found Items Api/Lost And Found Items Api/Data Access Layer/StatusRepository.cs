using Lost_And_Found_Items_Api.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace Lost_And_Found_Items_Api.Data_Access_Layer
{
    public class StatusRepository
    {
        private readonly CollegeLostAndFoundContext _context;
        public StatusRepository(CollegeLostAndFoundContext context) => _context = context;

        public async Task<List<Status>> GetAllAsync() => await _context.Statuses.ToListAsync();
        public async Task<Status> GetByIdAsync(int id) => await _context.Statuses.FindAsync(id);
        public async Task<Status> AddAsync(Status status)
        {
            _context.Statuses.Add(status);
            await _context.SaveChangesAsync();
            return status;
        }
        public async Task<Status> UpdateAsync(Status status)
        {
            _context.Statuses.Update(status);
            await _context.SaveChangesAsync();
            return status;
        }
        public async Task DeleteAsync(Status status)
        {
            _context.Statuses.Remove(status);
            await _context.SaveChangesAsync();
        }
    }
}
