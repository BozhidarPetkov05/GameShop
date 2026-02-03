using System.Collections.Generic;
using System.Linq;
using API.Infrastructure.RequestDTOs.Auth;
using API.Services;
using Common;
using Common.Entities;
using Common.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpPost]
        public IActionResult CreateToken([FromForm] AuthTokenRequest model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid data");
            }

            UserServices service = new UserServices();
            User loggedUser = service.GetAll()
                                        .FirstOrDefault(u =>
                                            u.Username == model.Username &&
                                            u.Password == model.Password);

            if (loggedUser == null)
            {
                return Unauthorized("Invalid username or password");
            }

            TokenServices tokenService = new TokenServices();

            string token = tokenService.CreateToken(loggedUser);

            return Ok(new
            {
                token = token
            });
        }
    }
}
