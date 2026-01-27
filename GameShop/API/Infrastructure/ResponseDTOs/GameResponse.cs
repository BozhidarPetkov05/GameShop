using System;
using System.Collections.Generic;

namespace API.Infrastructure.ResponseDTOs;

public class GameResponse
{
    public int Id { get; set; }
    public string Title { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; }
    public int GenreId { get; set; }
    public int CompanyId { get; set; }
    public List<int> PlatformIds { get; set; }
    public List<int> TagIds { get; set; }
}
