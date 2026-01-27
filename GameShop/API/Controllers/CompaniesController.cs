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
                return NotFound("Company with this id does not exist!");
            }

            var response = MapCompanyResponseDTO(company);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult Post([FromBody] CompanyRequest model)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Forbid("Invalid permissions. Admin access required.");
            }

            CompanyServices service = new CompanyServices();
            if (service.CompanyExist(model.Name))
            {
                return BadRequest("Company with this name already exists!");
            }


            var item = new Company()
            {
                Name = model.Name
            };

            service.Save(item);

            CompanyResponse response = MapCompanyResponseDTO(item);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id}")]
        public IActionResult Put([FromRoute] int id, [FromBody] CompanyRequest model)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Forbid("Invalid permissions. Admin access required.");
            }

            CompanyServices service = new CompanyServices();

            Company forUpdate = service.GetById(id);
            if (forUpdate == null)
            {
                return NotFound("Company with this id does not exist!");
            }

            forUpdate.Name = model.Name;
            service.Save(forUpdate);

            CompanyResponse response = MapCompanyResponseDTO(forUpdate);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete([FromRoute] int id)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Forbid("Invalid permissions. Admin access required.");
            }

            CompanyServices service = new CompanyServices();
            Company forDelete = service.GetById(id);

            if (forDelete == null)
            {
                return NotFound("Company with this id does not exist!");
            }

            service.Delete(forDelete);

            CompanyResponse response = MapCompanyResponseDTO(forDelete);
            return Ok(response);
        }

        private CompanyResponse MapCompanyResponseDTO(Company company)
        {
            var gameIds = new List<int>();
            if (gameIds != null)
            {
                gameIds = company.Games.Select(g => g.Id).ToList();
            }
            return new CompanyResponse()
            {
                Id = company.Id,
                Name = company.Name,
                GameIds = gameIds
            };
        }
    }
}
