using System;
using System.Collections.Generic;
using System.Linq;
using API.Infrastructure.RequestDTOs.Companies;
using API.Infrastructure.ResponseDTOs;
using Common.Entities;
using Common.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CompaniesController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            CompanyServices service = new CompanyServices();

            List<Company> companies = service.GetAll();
            List<CompanyResponse> responses = new List<CompanyResponse>();

            foreach (var company in companies)
            {
                CompanyResponse response = MapCompanyResponseDTO(company);
                responses.Add(response);
            }

            return Ok(responses);
        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult Get([FromRoute] int id)
        {
            CompanyServices service = new CompanyServices();
            Company company = service.GetById(id);
            if (company == null)
            {
                throw new Exception("Genre with this ID does not exist!");
            }

            var response = MapCompanyResponseDTO(company);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult Post([FromBody] CompanyRequest model)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Forbid();
            }

            CompanyServices service = new CompanyServices();
            if (service.CompanyExist(model.Name))
            {
                throw new Exception("Company with this name already exists!");
            }


            var item = new Company()
            {
                Name = model.Name
            };

            service.Save(item);

            CompanyResponse response = new CompanyResponse()
            {
                Id = item.Id,
                Name = item.Name,
                GameIds = item.Games.Select(g => g.Id).ToList()
            };
            return Ok(response);
        }

        [HttpPut]
        [Route("{id}")]
        public IActionResult Put([FromRoute] int id, [FromBody] CompanyRequest model)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Forbid();
            }

            CompanyServices service = new CompanyServices();
            if (service.CompanyExist(model.Name))
            {
                throw new Exception("Company with this name already exists!");
            }

            Company forUpdate = service.GetById(id);
            if (forUpdate == null)
            {
                throw new Exception("Company not found!");
            }

            forUpdate.Name = model.Name;
            service.Save(forUpdate);

            CompanyResponse response = new CompanyResponse()
            {
                Id = forUpdate.Id,
                Name = forUpdate.Name,
                GameIds = forUpdate.Games.Select(g => g.Id).ToList()
            };
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete([FromRoute] int id)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Forbid();
            }

            CompanyServices service = new CompanyServices();
            Company forDelete = service.GetById(id);

            if (forDelete == null)
            {
                throw new Exception("Company not found!");
            }

            service.Delete(forDelete);

            CompanyResponse response = new CompanyResponse()
            {
                Id = forDelete.Id,
                Name = forDelete.Name,
                GameIds = forDelete.Games.Select(g => g.Id).ToList()
            };
            return Ok(response);
        }

        private CompanyResponse MapCompanyResponseDTO(Company company)
        {
            return new CompanyResponse()
            {
                Id = company.Id,
                Name = company.Name,
                GameIds = company.Games.Select(g => g.Id).ToList()
            };
        }
    }
}
