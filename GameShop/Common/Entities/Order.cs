using System;
using System.Collections.Generic;

namespace Common.Entities;

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public decimal TotalPrice { get; set; }
    public int StatusId { get; set; }
    public string ShippingAddress { get; set; }

    public virtual User User { get; set; }
    public virtual Status Status { get; set; }

    public virtual List<OrderGame> OrderGames { get; set; }
}
