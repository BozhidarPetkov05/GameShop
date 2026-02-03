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
                return Unauthorized(new { message = "Invalid permissions. Admin access required." });
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
            var loggedUserId = User.FindFirst("loggedUserId")?.Value;

            if (!User.HasClaim("isAdmin", "True") && loggedUserId != id.ToString())
            {
                return Unauthorized(new { message = "Invalid permissions." });
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
            User forUpdate = service.GetById(id);

            if (forUpdate == null)
            {
                return NotFound("User not found!");
            }

            var isAdmin = User.FindFirst("isAdmin")?.Value == "True";
            var loggedUserId = User.FindFirst("loggedUserId")?.Value;


            if (!isAdmin && loggedUserId != id.ToString())
            {
                return Unauthorized(new { message = "Invalid permissions." });
            }

            if (!string.IsNullOrEmpty(model.Email))
            {
                forUpdate.Email = model.Email;
            }

            if (!string.IsNullOrEmpty(model.FirstName))
            {
                forUpdate.FirstName = model.FirstName;
            }

            if (!string.IsNullOrEmpty(model.LastName))
            {
                forUpdate.LastName = model.LastName;
            }

            if (!string.IsNullOrEmpty(model.Password))
            {
                forUpdate.Password = model.Password;
            }

            if (isAdmin)
            {
                forUpdate.IsAdmin = model.IsAdmin;
            }

            if (isAdmin && !string.IsNullOrEmpty(model.Username))
            {
                forUpdate.Username = model.Username;
            }

            service.Save(forUpdate);
            UserResponse response = MapUserResponseDTO(forUpdate);
            return Ok(response);
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
                    return Unauthorized(new { message = "Invalid permissions. Admin access required." });
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
            List<OrderResponse> orders = new List<OrderResponse>();
            OrderServices orderService = new OrderServices();

            if (user.Orders != null)
            {
                foreach (var order in user.Orders)
                {
                    var gameIds = new List<int>();
                    if (order.OrderGames != null)
                    {
                        gameIds = order.OrderGames.Select(og => og.GameId).ToList();
                    }

                    StatusServices service = new StatusServices();
                    orders.Add(new OrderResponse()
                    {
                        Id = order.Id,
                        UserId = order.UserId,
                        TotalPrice = order.TotalPrice,
                        Status = service.GetStatusName(order.StatusId),
                        ShippingAddress = order.ShippingAddress,
                        Games = orderService.GetGameNames(gameIds)
                    });
                }
            }

            return new UserResponse()
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Password = user.Password,
                FirstName = user.FirstName,
                LastName = user.LastName,
                IsAdmin = user.IsAdmin,
                Orders = orders
            };
        }
    }
}
