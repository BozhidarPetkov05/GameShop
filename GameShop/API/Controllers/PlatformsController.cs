using System;
using API.Infrastructure.RequestDTOs.Platforms;
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
    public class PlatformsController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            PlatformServices service = new PlatformServices();
            return Ok(service.GetAll());
        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult Get([FromRoute] int id)
        {
            PlatformServices service = new PlatformServices();
            return Ok(service.GetById(id));
        }

        [HttpPost]
        public IActionResult Post([FromBody] PlatformRequest model)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Forbid();
            }

            PlatformServices service = new PlatformServices();
            if (service.PlatformExist(model.Name))
            {
                throw new Exception("Platform with this name already exists!");
            }

            var item = new Platform()
            {
                Name = model.Name
            };

            service.Save(item);
            return Ok(item);
        }

        [HttpPut]
        [Route("{id}")]
        public IActionResult Put([FromRoute] int id, [FromBody] PlatformRequest model)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Forbid();
            }

            PlatformServices service = new PlatformServices();
            if (service.PlatformExist(model.Name))
            {
                throw new Exception("Platform with this name already exists!");
            }

            Platform forUpdate = service.GetById(id);

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

            PlatformServices service = new PlatformServices();
            Platform forDelete = service.GetById(id);

            if (forDelete == null)
            {
                throw new Exception("Platform not found!");
            }

            service.Delete(forDelete);
            return Ok(forDelete);
        }
    }
}
