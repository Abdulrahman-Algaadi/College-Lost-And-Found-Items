using System.ComponentModel.DataAnnotations;

public class ItemUpdateDto
{
    [Required]
    public int Id { get; set; }  // Must match URL

    [Required(ErrorMessage = "Title is required.")]
    [StringLength(150, ErrorMessage = "Title cannot exceed 150 characters.")]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [StringLength(256, ErrorMessage = "PhotoUrl cannot exceed 256 characters.")]
    public string? PhotoUrl { get; set; }

    [Required(ErrorMessage = "CategoryId is required.")]
    public int CategoryId { get; set; }

    [Required(ErrorMessage = "StatusId is required.")]
    public int StatusId { get; set; }

    [StringLength(150)]
    public string? Location { get; set; }

    [StringLength(200)]
    public string? ContactInfo { get; set; }

    public DateTime? DateReported { get; set; }

    // Optionally include UserId if needed
    public object? UserId { get; set; }
}
