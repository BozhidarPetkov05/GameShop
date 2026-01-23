using System;
using System.Collections.Generic;

namespace API.Infrastructure.RequestDTOs.Games;

public class GamesGetFilterRequest
{
    public string Title { get; set; }
    public int GenreId { get; set; }
    public int CompanyId { get; set; }
    public List<int> TagIds { get; set; }
    public List<int> PlatformIds { get; set; }
    public decimal MinPrice { get; set; }
    public decimal MaxPrice { get; set; }
}
