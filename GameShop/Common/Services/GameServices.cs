using System;
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
}
