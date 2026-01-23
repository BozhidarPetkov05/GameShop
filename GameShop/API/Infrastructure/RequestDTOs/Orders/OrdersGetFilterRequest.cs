using System;
using Common.Entities;

namespace API.Infrastructure.RequestDTOs.Orders;

public class OrdersGetFilterRequest
{
    public int OrderId { get; set; }
    public int UserId { get; set; }
    public int StatusId { get; set; }
}
