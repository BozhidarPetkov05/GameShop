using System;
using System.Collections.Generic;

namespace API.Infrastructure.ResponseDTOs;

public class CompanyResponse
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<string> Games { get; set; }
}
