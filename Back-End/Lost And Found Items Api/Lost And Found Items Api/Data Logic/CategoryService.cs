using Lost_And_Found_Items_Api.Data_Access_Layer;
using Lost_And_Found_Items_Api.Models;

namespace Lost_And_Found_Items_Api.Data_Logic
{
    public class CategoryService
    {
        private readonly CategoryRepository _repo;
        public CategoryService(CategoryRepository repo) => _repo = repo;

        public Task<List<Category>> GetAllAsync() => _repo.GetAllAsync();
        public Task<Category> GetByIdAsync(int id) => _repo.GetByIdAsync(id);
        public Task<Category> AddAsync(Category category) => _repo.AddAsync(category);
        public Task<Category> UpdateAsync(Category category) => _repo.UpdateAsync(category);
        public Task DeleteAsync(Category category) => _repo.DeleteAsync(category);
    }
}
