using System;
using System.Collections.Generic;

namespace Common.Entities;

public class Platform
{
    public int Id { get; set; }
    public string Name { get; set; }

    public virtual List<GamePlatform> GamePlatforms { get; set; }
}
