using System;
using System.Collections.Generic;

namespace API.Infrastructure.ResponseDTOs;

public class UserResponse
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public bool IsAdmin { get; set; }
    public List<OrderResponse> Orders { get; set; }
}
