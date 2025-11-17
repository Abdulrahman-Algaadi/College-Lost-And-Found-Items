using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace Lost_And_Found_Items_Api.Models;

[Index("Name", Name = "UQ__Statuses__737584F696D9F697", IsUnique = true)]
public partial class Status
{
    [Key]
    public int Id { get; set; }

    [StringLength(50)]
    public string Name { get; set; } = null!;

    [InverseProperty("Status")]
    [JsonIgnore]
    public virtual ICollection<Item> Items { get; set; } = new List<Item>();
}
