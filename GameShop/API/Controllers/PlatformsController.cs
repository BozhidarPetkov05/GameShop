using System;
using System.Collections.Generic;
using System.Linq;
using API.Infrastructure.RequestDTOs.Platforms;
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
    public class PlatformsController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            PlatformServices service = new PlatformServices();

            List<Platform> platforms = service.GetAll();
            List<PlatformResponse> responses = new List<PlatformResponse>();

            foreach (var platform in platforms)
            {
                PlatformResponse response = MapPlatformResponseDTO(platform);
                responses.Add(response);
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult Get([FromRoute] int id)
        {
            PlatformServices service = new PlatformServices();

            Platform platform = service.GetById(id);
            if (platform == null)
            {
                throw new Exception("Platform with this ID does not exist!");
            }

            PlatformResponse response = MapPlatformResponseDTO(platform);

            return Ok(response);
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

            PlatformResponse response = MapPlatformResponseDTO(item);
            return Ok(response);
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

            PlatformResponse response = MapPlatformResponseDTO(forUpdate);
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

            PlatformServices service = new PlatformServices();
            Platform forDelete = service.GetById(id);

            if (forDelete == null)
            {
                throw new Exception("Platform not found!");
            }

            service.Delete(forDelete);

            PlatformResponse response = MapPlatformResponseDTO(forDelete);
            return Ok(response);
        }

        private PlatformResponse MapPlatformResponseDTO(Platform platform)
        {
            return new PlatformResponse()
            {
                Id = platform.Id,
                Name = platform.Name,
                GameIds = platform.GamePlatforms.Select(gp => gp.GameId).ToList()
            };
        }
    }
}
