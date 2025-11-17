using Lost_And_Found_Items_Api.Data_Access_Layer;
using Lost_And_Found_Items_Api.Models;

namespace Lost_And_Found_Items_Api.Data_Logic
{
    public class StatusService
    {
        private readonly StatusRepository _repo;
        public StatusService(StatusRepository repo) => _repo = repo;

        public Task<List<Status>> GetAllAsync() => _repo.GetAllAsync();
        public Task<Status> GetByIdAsync(int id) => _repo.GetByIdAsync(id);
        public Task<Status> AddAsync(Status status) => _repo.AddAsync(status);
        public Task<Status> UpdateAsync(Status status) => _repo.UpdateAsync(status);
        public Task DeleteAsync(Status status) => _repo.DeleteAsync(status);
    }
}
