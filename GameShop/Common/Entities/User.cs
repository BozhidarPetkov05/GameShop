using System;
using System.Collections.Generic;

namespace Common.Entities;

public class User : BaseEntity
{
    public string Username { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public bool IsAdmin { get; set; }

    public virtual List<Order> Orders { get; set; }
}
