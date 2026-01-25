using Common.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            if (User.HasClaim("isAdmin", "False"))
            {
                return Unauthorized();
            }

            UserServices service = new UserServices();
            return Ok(service.GetAll());
        }
    }
}
