using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Lost_And_Found_Items_Api.Models
{
    public partial class Item
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required.")]
        [StringLength(150, ErrorMessage = "Title cannot exceed 150 characters.")]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [StringLength(256, ErrorMessage = "PhotoUrl cannot exceed 256 characters.")]
        public string? PhotoUrl { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required]
        public int StatusId { get; set; }

        [StringLength(150, ErrorMessage = "Location cannot exceed 150 characters.")]
        public string? Location { get; set; }

        [StringLength(200, ErrorMessage = "ContactInfo cannot exceed 200 characters.")]
        public string? ContactInfo { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime? DateReported { get; set; }

        // Navigation properties (ignored in JSON / Swagger)
        [JsonIgnore]
        [ForeignKey("CategoryId")]
        [InverseProperty("Items")]
        public virtual Category Category { get; set; } = null!;

        [JsonIgnore]
        [ForeignKey("StatusId")]
        [InverseProperty("Items")]
        public virtual Status Status { get; set; } = null!;

        [NotMapped]
        [JsonIgnore] // Hide from JSON / Swagger
        public object? UserId { get; internal set; }
    }
}
