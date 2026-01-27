using System;
using System.Linq;
using Common.Entities;

namespace Common.Services;

public class CompanyServices : BaseService<Company>
{
    public bool CompanyExist(string name)
    {
        return Items.Any(c => c.Name == name);
    }
}
