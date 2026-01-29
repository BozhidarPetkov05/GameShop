using System;
using System.Collections.Generic;

namespace API.Infrastructure.ResponseDTOs;

public class OrderResponse
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; }
    public string ShippingAddress { get; set; }

    public List<string> Games { get; set; }
}
