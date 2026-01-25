using System;
using System.Linq;
using Common.Entities;

namespace Common.Services;

public class UserServices : BaseService<User>
{
    public bool UserExists(string username)
    {
        return Items.Any(u => u.Username == username);
    }
}
