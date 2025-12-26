using System;
using System.Collections.Generic;

namespace Common.Entities;

public class Status : BaseEntity
{
    public string Name { get; set; }
    public virtual List<Order> Orders { get; set; }
}
