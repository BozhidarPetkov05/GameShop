using System;
using System.Linq;
using Common.Entities;

namespace Common.Services;

public class TagServices : BaseService<Tag>
{
    public bool TagExists(string name)
    {
        return Items.Any(t => t.Name == name);
    }
}
