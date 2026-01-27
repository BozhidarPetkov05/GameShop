using System;
using System.Linq;
using Common.Entities;

namespace Common.Services;

public class PlatformServices : BaseService<Platform>
{
    public bool PlatformExist(string name)
    {
        return Items.Any(p => p.Name == name);
    }
}
