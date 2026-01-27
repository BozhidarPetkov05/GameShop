using System;
using System.Collections.Generic;
using System.Linq;
using API.Infrastructure.RequestDTOs.Tags;
using API.Infrastructure.ResponseDTOs;
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

            List<Tag> tags = service.GetAll();
            List<TagResponse> responses = new List<TagResponse>();

            foreach (var tag in tags)
            {
                TagResponse response = MapTagResponseDTO(tag);
                responses.Add(response);
            }

            return Ok(responses);
        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult Get([FromRoute] int id)
        {
            TagServices service = new TagServices();

            Tag tag = service.GetById(id);
            if (tag == null)
            {
                return NotFound("Tag with this id does not exist!");
            }

            TagResponse response = MapTagResponseDTO(tag);

            return Ok(response);
        }

        [HttpPost]
        public IActionResult Post([FromBody] TagRequest model)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Forbid("Invalid permissions. Admin access required.");
            }

            TagServices service = new TagServices();
            if (service.TagExists(model.Name))
            {
                return BadRequest("Tag with this name already exists!");
            }

            var item = new Tag()
            {
                Name = model.Name
            };

            service.Save(item);

            TagResponse response = MapTagResponseDTO(item);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id}")]
        public IActionResult Put([FromRoute] int id, [FromBody] TagRequest model)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Forbid("Invalid permissions. Admin access required.");
            }

            TagServices service = new TagServices();

            Tag forUpdate = service.GetById(id);
            if (forUpdate == null)
            {
                return NotFound("Tag with this id does not exist!");
            }

            forUpdate.Name = model.Name;
            service.Save(forUpdate);

            TagResponse response = MapTagResponseDTO(forUpdate);
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

            TagServices services = new TagServices();
            Tag forDelete = services.GetById(id);

            if (forDelete == null)
            {
                return NotFound("Tag with this id does not exist!");
            }

            services.Delete(forDelete);

            TagResponse response = MapTagResponseDTO(forDelete);
            return Ok(response);
        }

        private TagResponse MapTagResponseDTO(Tag tag)
        {
            return new TagResponse()
            {
                Id = tag.Id,
                Name = tag.Name,
                GameIds = tag.GameTags.Select(g => g.GameId).ToList()
            };
        }
    }
}
