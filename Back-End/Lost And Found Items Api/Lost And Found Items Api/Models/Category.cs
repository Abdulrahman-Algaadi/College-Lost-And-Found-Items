using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace Lost_And_Found_Items_Api.Models;

[Index("Name", Name = "UQ__Categori__737584F69B266612", IsUnique = true)]
public partial class Category
{
    [Key]
    public int Id { get; set; }

    [Required(ErrorMessage = "Category name is required.")]
    [StringLength(50, ErrorMessage = "Category name cannot exceed 50 characters.")]
    public string Name { get; set; } = string.Empty;

    // Navigation property
    [InverseProperty("Category")]
    [JsonIgnore]
    public virtual ICollection<Item> Items { get; set; } = new List<Item>();
}
