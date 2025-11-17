using Lost_And_Found_Items_Api.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace Lost_And_Found_Items_Api.Data_Access_Layer
{
    public class CategoryRepository
    {
        private readonly CollegeLostAndFoundContext _context;
        public CategoryRepository(CollegeLostAndFoundContext context) => _context = context;

        public async Task<List<Category>> GetAllAsync() => await _context.Categories.ToListAsync();
        public async Task<Category> GetByIdAsync(int id) => await _context.Categories.FindAsync(id);
        public async Task<Category> AddAsync(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }
        public async Task<Category> UpdateAsync(Category category)
        {
            _context.Categories.Update(category);
            await _context.SaveChangesAsync();
            return category;
        }
        public async Task DeleteAsync(Category category)
        {
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
        }
    }
}
