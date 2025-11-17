using System.ComponentModel.DataAnnotations;

namespace Lost_And_Found_Items_Api.Models
{
    public class ItemCreateDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }
        public string? PhotoUrl { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required]
        public int StatusId { get; set; }

        public string? Location { get; set; }
        public string? ContactInfo { get; set; }
        public DateTime? DateReported { get; set; }
    }
}
