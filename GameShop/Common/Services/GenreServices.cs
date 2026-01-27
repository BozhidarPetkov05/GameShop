using System;
using System.Linq;
using Common.Entities;

namespace Common.Services;

public class GenreServices : BaseService<Genre>
{
    public bool GenreExist(string name)
    {
        return Items.Any(g => g.Name == name);
    }
}
