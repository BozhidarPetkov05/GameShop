using System;
using System.Collections.Generic;
using System.Linq;
using Common.Entities;

namespace Common.Services;

public class PlatformServices : BaseService<Platform>
{
    public bool PlatformExist(string name)
    {
        return Items.Any(p => p.Name == name);
    }

    public List<string> GetGameNames(List<int> ids)
    {
        if (ids == null || ids.Count == 0)
        {
            return new List<string>();
        }

        var gameNames = Context.Set<Game>()
            .Where(g => ids.Contains(g.Id))
            .Select(g => g.Title)
            .ToList();

        return gameNames;
    }
}
