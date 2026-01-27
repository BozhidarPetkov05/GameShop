using System;
using System.Collections.Generic;
using System.Linq;
using API.Infrastructure.RequestDTOs.Games;
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
    public class GamesController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            GameServices service = new GameServices();

            List<Game> games = service.GetAll();
            List<GameResponse> responses = new List<GameResponse>();

            foreach (var game in games)
            {
                var response = MapGameResponseDTO(game);
                responses.Add(response);
            }

            return Ok(responses);
        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult Get([FromRoute] int id)
        {
            GameServices service = new GameServices();

            Game item = service.GetById(id);
            if (item == null)
            {
                return NotFound("Game with this id does not exist!");
            }

            var response = MapGameResponseDTO(item);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult Post([FromBody] GameRequest model)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Forbid("Invalid permissions. Admin access required.");
            }

            GameServices service = new GameServices();
            if (service.GameExist(model.Title))
            {
                return BadRequest("Game with this title already exists!");
            }

            var item = new Game()
            {
                Title = model.Title,
                Price = model.Price,
                Description = model.Description,
                GenreId = model.GenreId,
                CompanyId = model.CompanyId,
            };

            service.Save(item);

            foreach (var platformId in model.PlatformIds)
            {
                var gamePlatform = new GamePlatform()
                {
                    GameId = item.Id,
                    PlatformId = platformId
                };
                service.SaveGamePlatform(gamePlatform);
            }

            foreach (var tagId in model.TagIds)
            {
                var gameTag = new GameTag()
                {
                    GameId = item.Id,
                    TagId = tagId
                };
                service.SaveGameTag(gameTag);
            }

            var response = MapGameResponseDTO(item);

            return Ok(response);
        }

        [HttpPut]
        [Route("{id}")]
        public IActionResult Put([FromRoute] int id, [FromBody] GameRequest model)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Forbid("Invalid permissions. Admin access required.");
            }

            GameServices service = new GameServices();

            Game forUpdate = service.GetById(id);
            if (forUpdate == null)
            {
                return NotFound("Game with this id does not exist!");
            }

            service.DeleteGamePlatformsByGameId(forUpdate.Id);
            service.DeleteGameTagsByGameId(forUpdate.Id);

            forUpdate.Title = model.Title;
            forUpdate.Price = model.Price;
            forUpdate.Description = model.Description;
            forUpdate.GenreId = model.GenreId;
            forUpdate.CompanyId = model.CompanyId;

            foreach (var platformId in model.PlatformIds)
            {
                var gamePlatform = new GamePlatform()
                {
                    GameId = forUpdate.Id,
                    PlatformId = platformId
                };
                service.SaveGamePlatform(gamePlatform);
            }

            foreach (var tagId in model.TagIds)
            {
                var gameTag = new GameTag()
                {
                    GameId = forUpdate.Id,
                    TagId = tagId
                };
                service.SaveGameTag(gameTag);
            }

            service.Save(forUpdate);

            var response = MapGameResponseDTO(forUpdate);

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

            GameServices service = new GameServices();
            Game forDelete = service.GetById(id);

            if (forDelete == null)
            {
                return NotFound("Game with this id does not exist!");
            }

            service.DeleteGamePlatformsByGameId(forDelete.Id);
            service.DeleteGameTagsByGameId(forDelete.Id);

            service.Delete(forDelete);

            var response = MapGameResponseDTO(forDelete);
            return Ok(response);
        }

        private GameResponse MapGameResponseDTO(Game game)
        {
            return new GameResponse()
            {
                Id = game.Id,
                Title = game.Title,
                Price = game.Price,
                Description = game.Description,
                GenreId = game.GenreId,
                CompanyId = game.CompanyId,
                PlatformIds = game.GamePlatforms.Select(gp => gp.PlatformId).ToList(),
                TagIds = game.GameTags.Select(gt => gt.TagId).ToList()
            };
        }
    }
}
