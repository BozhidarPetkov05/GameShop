using System;
using API.Infrastructure.RequestDTOs.Genres;
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
    public class GenresController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            GenreServices service = new GenreServices();
            return Ok(service.GetAll());
        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult Get([FromRoute] int id)
        {
            GenreServices service = new GenreServices();
            return Ok(service.GetById(id));
        }

        [HttpPost]
        public IActionResult Post([FromBody] GenreRequest model)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Forbid();
            }

            GenreServices service = new GenreServices();
            if (service.GenreExist(model.Name))
            {
                throw new Exception("Genre with this name already exists!");
            }

            var item = new Genre()
            {
                Name = model.Name
            };

            service.Save(item);
            return Ok(item);
        }

        [HttpPut]
        [Route("{id}")]
        public IActionResult Put([FromRoute] int id, [FromBody] GenreRequest model)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Forbid();
            }

            GenreServices service = new GenreServices();
            if (service.GenreExist(model.Name))
            {
                throw new Exception("Genre with this name already exists!");
            }

            Genre forUpdate = service.GetById(id);

            if (forUpdate == null)
            {
                throw new Exception("Genre not found!");
            }

            forUpdate.Name = model.Name;
            service.Save(forUpdate);
            return Ok(forUpdate);
        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete([FromRoute] int id)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Forbid();
            }

            GenreServices service = new GenreServices();
            Genre forDelete = service.GetById(id);

            if (forDelete == null)
            {
                throw new Exception("Genre not found!");
            }

            service.Delete(forDelete);
            return Ok(forDelete);
        }
    }
}
