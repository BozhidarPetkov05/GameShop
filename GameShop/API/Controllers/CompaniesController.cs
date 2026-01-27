using System;
using API.Infrastructure.RequestDTOs.Companies;
using Common.Entities;
using Common.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompaniesController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            CompanyServices service = new CompanyServices();
            return Ok(service.GetAll());
        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult Get([FromRoute] int id)
        {
            CompanyServices service = new CompanyServices();
            return Ok(service.GetById(id));
        }

        [HttpPost]
        public IActionResult Post([FromBody] CompanyRequest model)
        {
            CompanyServices service = new CompanyServices();
            if (service.CompanyExist(model.Name))
            {
                throw new Exception("Company with this name already exists!");
            }

            if (!User.HasClaim("isAdmin", "True"))
            {
                return Forbid();
            }

            var item = new Company()
            {
                Name = model.Name
            };

            service.Save(item);
            return Ok(item);
        }
    }
}
