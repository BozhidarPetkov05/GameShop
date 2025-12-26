using System;
using System.Collections.Generic;

namespace Common.Entities;

public class Tag : BaseEntity
{
    public string Name { get; set; }

    public virtual List<GameTag> GameTags { get; set; }
}
