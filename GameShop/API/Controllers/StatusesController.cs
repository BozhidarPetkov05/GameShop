using System.Collections.Generic;
using System.Linq;
using API.Infrastructure.RequestDTOs.Statuses;
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
    public class StatusesController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Unauthorized(new { message = "Invalid permissions. Admin access required." });
            }

            StatusServices service = new StatusServices();

            List<Status> statuses = service.GetAll();
            List<StatusResponse> responses = new List<StatusResponse>();

            foreach (var status in statuses)
            {
                StatusResponse response = MapStatusResponseDTO(status);
                responses.Add(response);
            }

            return Ok(responses);
        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult Get([FromRoute] int id)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Unauthorized(new { message = "Invalid permissions. Admin access required." });
            }

            StatusServices service = new StatusServices();

            Status status = service.GetById(id);
            if (status == null)
            {
                return NotFound("Status with this id does not exist");
            }

            StatusResponse response = MapStatusResponseDTO(status);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult Post([FromBody] StatusRequest model)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Unauthorized(new { message = "Invalid permissions. Admin access required." });
            }

            StatusServices service = new StatusServices();
            if (service.StatusExist(model.Name))
            {
                return BadRequest("Status with this name already exists!");
            }

            var item = new Status()
            {
                Name = model.Name
            };

            service.Save(item);

            StatusResponse response = MapStatusResponseDTO(item);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id}")]
        public IActionResult Put([FromRoute] int id, [FromBody] StatusRequest model)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Unauthorized(new { message = "Invalid permissions. Admin access required." });
            }

            StatusServices service = new StatusServices();

            Status forUpdate = service.GetById(id);
            if (forUpdate == null)
            {
                return NotFound("Status with this id does not exist!");
            }

            forUpdate.Name = model.Name;
            service.Save(forUpdate);

            StatusResponse response = MapStatusResponseDTO(forUpdate);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete([FromRoute] int id)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Unauthorized(new { message = "Invalid permissions. Admin access required." });
            }

            StatusServices service = new StatusServices();

            Status forDelete = service.GetById(id);
            if (forDelete == null)
            {
                return NotFound("Status with this id does not exist");
            }

            service.Delete(forDelete);

            StatusResponse response = MapStatusResponseDTO(forDelete);
            return Ok(response);
        }

        private StatusResponse MapStatusResponseDTO(Status status)
        {
            OrderServices orderService = new OrderServices();
            List<OrderResponse> orders = new List<OrderResponse>();

            if (status.Orders != null)
            {
                foreach (var order in status.Orders)
                {
                    var gameIds = new List<int>();
                    if (order.OrderGames != null)
                    {
                        gameIds = order.OrderGames.Select(og => og.GameId).ToList();
                    }

                    StatusServices services = new StatusServices();
                    orders.Add(new OrderResponse()
                    {
                        Id = order.Id,
                        UserId = order.UserId,
                        TotalPrice = order.TotalPrice,
                        Status = services.GetStatusName(order.StatusId),
                        ShippingAddress = order.ShippingAddress,
                        Games = orderService.GetGameNames(gameIds)
                    });
                }
            }

            return new StatusResponse()
            {
                Id = status.Id,
                Name = status.Name,
                Orders = orders
            };
        }
    }
}
