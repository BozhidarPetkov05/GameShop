using System;
using System.Collections.Generic;

namespace Common.Entities;

public class Company
{
    public int Id { get; set; }
    public string Name { get; set; }

    public virtual List<Game> Games { get; set; }
}
