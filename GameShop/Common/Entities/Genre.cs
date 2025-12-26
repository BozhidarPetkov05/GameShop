using System;
using System.Collections.Generic;

namespace Common.Entities;

public class Genre
{
    public int Id { get; set; }
    public string Name { get; set; }

    public virtual List<Game> Games { get; set; }
}
