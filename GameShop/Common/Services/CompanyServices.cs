using System;
using System.Collections.Generic;
using System.Linq;
using Common.Entities;

namespace Common.Services;

public class CompanyServices : BaseService<Company>
{
    public bool CompanyExist(string name)
    {
        return Items.Any(c => c.Name == name);
    }

    public List<string> ReturnNames(List<int> gameIds)
    {
        if (gameIds == null || gameIds.Count == 0)
        {
            return new List<string>();
        }

        var gameNames = Context.Set<Game>()
            .Where(g => gameIds.Contains(g.Id))
            .Select(g => g.Title)
            .ToList();

        return gameNames;
    }
}
