using Lost_And_Found_Items_Api.Data_Access_Layer;
using Lost_And_Found_Items_Api.Models;

namespace Lost_And_Found_Items_Api.Data_Logic
{
    public class ItemService
    {
        private readonly ItemRepository _repo;
        public ItemService(ItemRepository repo) => _repo = repo;

        public Task<List<Item>> GetAllAsync() => _repo.GetAllAsync();
        public Task<Item> GetByIdAsync(int id) => _repo.GetByIdAsync(id);

        public Task<Item> AddAsync(Item item)
        {
            if (item.StatusId == 0) item.StatusId = 1; // default Lost
            return _repo.AddAsync(item);
        }

        public Task<Item> UpdateAsync(Item item) => _repo.UpdateAsync(item);
        public Task DeleteAsync(Item item) => _repo.DeleteAsync(item);
    }
}
