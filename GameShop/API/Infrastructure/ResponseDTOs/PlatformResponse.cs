using System;
using System.Collections.Generic;

namespace API.Infrastructure.ResponseDTOs;

public class PlatformResponse
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<int> GameIds { get; set; }
}
