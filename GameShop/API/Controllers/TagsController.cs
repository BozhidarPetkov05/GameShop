using System;
using API.Infrastructure.RequestDTOs.Tags;
using Common.Entities;
using Common.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TagsController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            TagServices service = new TagServices();
            return Ok(service.GetAll());
        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult Get([FromRoute] int id)
        {
            TagServices service = new TagServices();
            return Ok(service.GetById(id));
        }

        [HttpPost]
        public IActionResult Post([FromBody] TagRequest model)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Forbid();
            }

            TagServices service = new TagServices();
            if (service.TagExists(model.Name))
            {
                throw new Exception("Tag with this name already exists!");
            }

            var item = new Tag()
            {
                Name = model.Name
            };

            service.Save(item);

            return Ok(item);
        }

        [HttpPut]
        [Route("{id}")]
        public IActionResult Put([FromRoute] int id, [FromBody] TagRequest model)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Forbid();
            }

            TagServices service = new TagServices();
            if (service.TagExists(model.Name))
            {
                throw new Exception("Tag with this name already exists!");
            }

            Tag forUpdate = service.GetById(id);

            if (forUpdate == null)
            {
                throw new Exception("Tag not found!");
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

            TagServices services = new TagServices();
            Tag forDelete = services.GetById(id);

            if (forDelete == null)
            {
                throw new Exception("Tag not found!");
            }

            services.Delete(forDelete);
            return Ok(forDelete);
        }
    }
}
