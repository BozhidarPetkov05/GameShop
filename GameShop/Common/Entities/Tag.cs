using System;
using System.Collections.Generic;

namespace Common.Entities;

public class Tag
{
    public int Id { get; set; }
    public string Name { get; set; }

    public virtual List<GameTag> GameTags { get; set; }
}
