using System;
using System.Collections.Generic;

namespace API.Infrastructure.ResponseDTOs;

public class GameResponse
{
    public int Id { get; set; }
    public string Title { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; }
    public string Genre { get; set; }
    public string Company { get; set; }
    public List<string> Platforms { get; set; }
    public List<string> Tags { get; set; }
}
