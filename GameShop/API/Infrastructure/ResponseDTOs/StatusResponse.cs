using System;
using System.Collections.Generic;

namespace API.Infrastructure.ResponseDTOs;

public class StatusResponse
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<OrderResponse> Orders { get; set; }
}
