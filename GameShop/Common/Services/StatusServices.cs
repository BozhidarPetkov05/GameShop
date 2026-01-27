using System;
using System.Linq;
using Common.Entities;
using Microsoft.EntityFrameworkCore.Query;

namespace Common.Services;

public class StatusServices : BaseService<Status>
{
    public bool StatusExist(string name)
    {
        return Items.Any(s => s.Name == name);
    }
}
