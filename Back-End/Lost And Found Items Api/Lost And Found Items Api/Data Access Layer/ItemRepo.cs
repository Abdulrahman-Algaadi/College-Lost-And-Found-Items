using Lost_And_Found_Items_Api.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace Lost_And_Found_Items_Api.Data_Access_Layer
{
    public class ItemRepository
    {
        private readonly CollegeLostAndFoundContext _context;
        public ItemRepository(CollegeLostAndFoundContext context) => _context = context;

        public async Task<List<Item>> GetAllAsync() =>
            await _context.Items.Include(i => i.Category).Include(i => i.Status).ToListAsync();

        public async Task<Item> GetByIdAsync(int id) =>
            await _context.Items.Include(i => i.Category).Include(i => i.Status)
                .FirstOrDefaultAsync(i => i.Id == id);

        public async Task<Item> AddAsync(Item item)
        {
            _context.Items.Add(item);
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<Item> UpdateAsync(Item item)
        {
            _context.Items.Update(item);
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task DeleteAsync(Item item)
        {
            _context.Items.Remove(item);
            await _context.SaveChangesAsync();
        }
    }
}