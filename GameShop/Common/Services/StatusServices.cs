using System;
using System.Collections.Generic;
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

    public string GetStatusName(int id)
    {
        return Context.Set<Status>()
            .Where(s => s.Id == id)
            .Select(s => s.Name)
            .FirstOrDefault();
    }
}
