using System;
using System.Collections.Generic;

namespace API.Infrastructure.ResponseDTOs;

public class TagResponse
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<string> Games { get; set; }
}
