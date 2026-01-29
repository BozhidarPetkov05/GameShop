using System;
using System.Collections.Generic;

namespace API.Infrastructure.ResponseDTOs;

public class GenreResponse
{
    public int Id { get; set; }
    public string Name { get; set; }

    public List<string> Games { get; set; }
}
