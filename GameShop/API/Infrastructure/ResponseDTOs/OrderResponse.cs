using System;
using System.Collections.Generic;

namespace API.Infrastructure.ResponseDTOs;

public class OrderResponse
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public decimal TotalPrice { get; set; }
    public int StatusId { get; set; }
    public string ShippingAddress { get; set; }

    public List<int> GameIds { get; set; }
}
