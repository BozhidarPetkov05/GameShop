using System;
using System.Collections.Generic;

namespace Common.Entities;

public class Game : BaseEntity
{
    public string Title { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; }
    public int GenreId { get; set; }
    public int CompanyId { get; set; }

    public virtual Genre Genre { get; set; }
    public virtual Company Company { get; set; }

    public virtual List<GamePlatform> GamePlatforms { get; set; }
    public virtual List<OrderGame> OrderGames { get; set; }
    public virtual List<GameTag> GameTags { get; set; }
}
