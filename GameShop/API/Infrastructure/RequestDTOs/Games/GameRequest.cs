using System;
using System.Collections.Generic;

namespace API.Infrastructure.RequestDTOs.Games;

public class GameRequest
{
    public string Title { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; }
    public string Genre { get; set; }
    public string Company { get; set; }

    public List<string> Platforms { get; set; }
    public List<string> Tags { get; set; }

}
