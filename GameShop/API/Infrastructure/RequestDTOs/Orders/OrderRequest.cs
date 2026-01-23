using System;
using System.Collections.Generic;

namespace API.Infrastructure.RequestDTOs.Orders;

public class OrderRequest
{
    public string ShippingAddress { get; set; }

    public List<int> GameIds { get; set; }
}
