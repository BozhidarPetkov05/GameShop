using System;
using System.Collections.Generic;
using System.Linq;
using API.Infrastructure.RequestDTOs.Genres;
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
    public class GenresController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            GenreServices service = new GenreServices();

            List<Genre> genres = service.GetAll();
            List<GenreResponse> responses = new List<GenreResponse>();

            foreach (var genre in genres)
            {
                var response = MapGenreResponseDTO(genre);
                responses.Add(response);
            }

            return Ok(responses);
        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult Get([FromRoute] int id)
        {
            GenreServices service = new GenreServices();

            Genre genre = service.GetById(id);
            if (genre == null)
            {
                return NotFound("Genre with this id does not exist!");
            }

            var response = MapGenreResponseDTO(genre);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult Post([FromBody] GenreRequest model)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Forbid("Invalid permissions. Admin access required.");
            }

            GenreServices service = new GenreServices();
            if (service.GenreExist(model.Name))
            {
                return BadRequest("Genre with this name already exists!");
            }

            var item = new Genre()
            {
                Name = model.Name
            };

            service.Save(item);

            var response = MapGenreResponseDTO(item);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id}")]
        public IActionResult Put([FromRoute] int id, [FromBody] GenreRequest model)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Forbid("Invalid permissions. Admin access required.");
            }

            GenreServices service = new GenreServices();

            Genre forUpdate = service.GetById(id);

            if (forUpdate == null)
            {
                return NotFound("Genre with this id does not exist!");
            }

            forUpdate.Name = model.Name;
            service.Save(forUpdate);

            var response = MapGenreResponseDTO(forUpdate);
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

            GenreServices service = new GenreServices();
            Genre forDelete = service.GetById(id);

            if (forDelete == null)
            {
                return NotFound("Genre with this id does not exist!");
            }

            service.Delete(forDelete);

            var response = MapGenreResponseDTO(forDelete);
            return Ok(response);
        }

        private GenreResponse MapGenreResponseDTO(Genre genre)
        {
            var gameIds = new List<int>();
            if (genre.Games != null)
            {
                gameIds = genre.Games.Select(g => g.Id).ToList();
            }
            return new GenreResponse()
            {
                Id = genre.Id,
                Name = genre.Name,
                GameIds = gameIds
            };
        }
    }
}
