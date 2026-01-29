using System;
using System.Collections.Generic;
using System.Linq;
using API.Infrastructure.RequestDTOs.Users;
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
    public class UsersController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Forbid("Invalid permissions. Admin access required.");
            }

            UserServices service = new UserServices();

            List<User> users = service.GetAll();
            List<UserResponse> responses = new List<UserResponse>();

            foreach (var user in users)
            {
                UserResponse response = MapUserResponseDTO(user);
                responses.Add(response);
            }

            return Ok(responses);
        }


        [HttpGet]
        [Route("{id}")]
        public IActionResult Get([FromRoute] int id)
        {
            if (!User.HasClaim("loggedUserId", id.ToString()))
            {
                return Forbid("Invalid permissions. Admin access required.");
            }

            UserServices service = new UserServices();

            User user = service.GetById(id);
            if (user == null)
            {
                return NotFound("User with this id does not exist");
            }

            UserResponse response = MapUserResponseDTO(user);

            return Ok(response);
        }

        [HttpPost]
        public IActionResult Post([FromBody] UserRequest model)
        {
            UserServices service = new UserServices();
            if (service.UserExists(model.Username))
            {
                return BadRequest("User with this username already exists!");
            }

            UserResponse response;
            if (!User.HasClaim("isAdmin", "True"))
            {
                var item = new User
                {
                    Username = model.Username,
                    Email = model.Email,
                    Password = model.Password,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    IsAdmin = false
                };
                service.Save(item);
                response = MapUserResponseDTO(item);
            }
            else
            {
                var item = new User
                {
                    Username = model.Username,
                    Email = model.Email,
                    Password = model.Password,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    IsAdmin = model.IsAdmin
                };
                service.Save(item);
                response = MapUserResponseDTO(item);
            }

            return Ok(response);
        }

        [HttpPut]
        [Route("{id}")]
        public IActionResult Put([FromRoute] int id, [FromBody] UserRequest model)
        {
            UserServices service = new UserServices();

            if (!User.HasClaim("isAdmin", "True"))
            {
                if (User.HasClaim("loggedUserId", id.ToString()))
                {
                    User forUpdate = service.GetById(id);

                    if (forUpdate == null)
                    {
                        return NotFound("User not found!");
                    }

                    forUpdate.Username = model.Username;
                    forUpdate.Email = model.Email;
                    forUpdate.Password = model.Password;
                    forUpdate.FirstName = model.FirstName;
                    forUpdate.LastName = model.LastName;

                    service.Save(forUpdate);

                    UserResponse response = MapUserResponseDTO(forUpdate);
                    return Ok(response);
                }
                else
                {
                    return Forbid("Invalid permissions. Admin access required.");
                }
            }
            else
            {
                User forUpdate = service.GetById(id);

                if (forUpdate == null)
                {
                    return NotFound("User not found!");
                }

                forUpdate.Username = model.Username;
                forUpdate.Email = model.Email;
                forUpdate.Password = model.Password;
                forUpdate.FirstName = model.FirstName;
                forUpdate.LastName = model.LastName;
                forUpdate.IsAdmin = model.IsAdmin;

                UserResponse response = MapUserResponseDTO(forUpdate);
                return Ok(response);
            }
        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete([FromRoute] int id)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                if (User.HasClaim("loggedUserId", id.ToString()))
                {
                    UserServices service = new UserServices();
                    User forDelete = service.GetById(id);
                    if (forDelete == null)
                    {
                        return NotFound("User not found!");
                    }
                    service.Delete(forDelete);

                    UserResponse response = MapUserResponseDTO(forDelete);
                    return Ok(response);
                }
                else
                {
                    return Forbid("Invalid permissions. Admin access required.");
                }
            }
            else
            {
                UserServices service = new UserServices();
                User forDelete = service.GetById(id);
                if (forDelete == null)
                {
                    return NotFound("User not found!");
                }
                service.Delete(forDelete);

                UserResponse response = MapUserResponseDTO(forDelete);
                return Ok(response);
            }
        }

        private UserResponse MapUserResponseDTO(User user)
        {
            var orderIds = new List<int>();
            if (user.Orders != null)
            {
                orderIds = user.Orders.Select(o => o.Id).ToList();
            }

            return new UserResponse()
            {
                Id = user.Id,
                Email = user.Email,
                Password = user.Password,
                FirstName = user.FirstName,
                LastName = user.LastName,
                OrderIds = orderIds
            };
        }
    }
}
