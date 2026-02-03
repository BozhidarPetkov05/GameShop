using System;
using System.Collections.Generic;
using System.Linq;
using Common.Entities;

namespace Common.Services;

public class GameServices : BaseService<Game>
{
    public bool GameExist(string title)
    {
        return Items.Any(g => g.Title == title);
    }

    public void SaveGamePlatform(GamePlatform gp)
    {
        Context.Set<GamePlatform>().Add(gp);
        Context.SaveChanges();
    }

    public void SaveGameTag(GameTag gt)
    {
        Context.Set<GameTag>().Add(gt);
        Context.SaveChanges();
    }

    public void DeleteGamePlatformsByGameId(int id)
    {
        var platforms = Context.Set<GamePlatform>().Where(gp => gp.GameId == id).ToList();
        foreach (var platform in platforms)
        {
            Context.Set<GamePlatform>().Remove(platform);
        }
        Context.SaveChanges();
    }

    public void DeleteGameTagsByGameId(int id)
    {
        var tags = Context.Set<GameTag>().Where(gt => gt.GameId == id).ToList();
        foreach (var tag in tags)
        {
            Context.Set<GameTag>().Remove(tag);
        }
        Context.SaveChanges();
    }

    public string GetGenreName(int id)
    {
        return Context.Set<Genre>()
            .Where(g => g.Id == id)
            .Select(g => g.Name)
            .FirstOrDefault();
    }

    public string GetCompanyName(int id)
    {
        return Context.Set<Company>()
            .Where(c => c.Id == id)
            .Select(c => c.Name)
            .FirstOrDefault();
    }

    public List<string> GetPlatformNames(List<int> ids)
    {
        if (ids == null || ids.Count == 0)
        {
            return new List<string>();
        }

        return Context.Set<Platform>()
            .Where(p => ids.Contains(p.Id))
            .Select(p => p.Name)
            .ToList();
    }

    public List<string> GetTagNames(List<int> ids)
    {
        if (ids == null || ids.Count == 0)
        {
            return new List<string>();
        }

        return Context.Set<Tag>()
            .Where(t => ids.Contains(t.Id))
            .Select(t => t.Name)
            .ToList();
    }

}
