using System;
using API.Infrastructure.RequestDTOs.Users;
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
                return Forbid();
            }

            UserServices service = new UserServices();
            return Ok(service.GetAll());
        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult Get([FromRoute] int id)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Forbid();
            }

            UserServices service = new UserServices();
            return Ok(service.GetById(id));
        }

        [HttpPost]
        public IActionResult Post([FromBody] UserRequest model)
        {
            UserServices service = new UserServices();
            if (service.UserExists(model.Username))
            {
                throw new Exception("User with this username already exists!");
            }

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
            }

            return Ok(model);
        }

        [HttpPut]
        [Route("{id}")]
        public IActionResult Put([FromRoute] int id, [FromBody] UserRequest model)
        {
            UserServices service = new UserServices();
            if (service.UserExists(model.Username))
            {
                throw new Exception("User with this username already exists!");
            }
            if (!User.HasClaim("isAdmin", "True"))
            {
                if (User.HasClaim("loggedUserId", id.ToString()))
                {
                    User forUpdate = service.GetById(id);

                    if (forUpdate == null)
                    {
                        throw new Exception("User not found!");
                    }

                    forUpdate.Username = model.Username;
                    forUpdate.Email = model.Email;
                    forUpdate.Password = model.Password;
                    forUpdate.FirstName = model.FirstName;
                    forUpdate.LastName = model.LastName;

                    service.Save(forUpdate);
                    return Ok(forUpdate);
                }
                else
                {
                    return Forbid();
                }
            }
            else
            {
                User forUpdate = service.GetById(id);

                if (forUpdate == null)
                {
                    throw new Exception("User not found!");
                }

                forUpdate.Username = model.Username;
                forUpdate.Email = model.Email;
                forUpdate.Password = model.Password;
                forUpdate.FirstName = model.FirstName;
                forUpdate.LastName = model.LastName;
                forUpdate.IsAdmin = model.IsAdmin;

                service.Save(forUpdate);
                return Ok(forUpdate);
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
                        throw new Exception("User not found!");
                    }
                    service.Delete(forDelete);
                    return Ok(forDelete);
                }
                else
                {
                    return Forbid();
                }
            }
            else
            {
                UserServices service = new UserServices();
                User forDelete = service.GetById(id);
                if (forDelete == null)
                {
                    throw new Exception("User not found!");
                }
                service.Delete(forDelete);
                return Ok(forDelete);
            }
        }
    }
}
