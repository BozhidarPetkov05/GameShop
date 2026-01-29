using System.Collections.Generic;
using System.Linq;
using API.Infrastructure.RequestDTOs.Orders;
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
    public class OrdersController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            OrderServices service = new OrderServices();

            List<Order> orders = service.GetAll();
            List<OrderResponse> responses = new List<OrderResponse>();

            if (!User.HasClaim("isAdmin", "True"))
            {
                int loggedUserId = int.Parse(User.FindFirst("loggedUserId").Value);

                foreach (var order in orders)
                {
                    if (loggedUserId == order.UserId)
                    {
                        OrderResponse response = MapOrderResponseDTO(order);
                        responses.Add(response);
                    }
                }
            }
            else
            {
                foreach (var order in orders)
                {
                    OrderResponse response = MapOrderResponseDTO(order);
                    responses.Add(response);
                }

            }

            return Ok(responses);
        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult Get([FromRoute] int id)
        {
            OrderServices service = new OrderServices();
            Order order = service.GetById(id);
            if (order == null)
            {
                return NotFound("Order with this id does not exist!");
            }

            int loggedUserId = int.Parse(User.FindFirst("loggedUserId").Value);
            if (!User.HasClaim("isAdmin", "True"))
            {
                if (loggedUserId != order.UserId)
                {
                    return Forbid("Invalid permissions. Admin access required.");
                }

                OrderResponse response = MapOrderResponseDTO(order);
                return Ok(response);
            }
            else
            {
                OrderResponse response = MapOrderResponseDTO(order);
                return Ok(response);
            }
        }

        [HttpPost]
        public IActionResult Post([FromBody] OrderRequest model)
        {
            OrderServices service = new OrderServices();
            int loggedUserId = int.Parse(User.FindFirst("loggedUserId").Value);

            var item = new Order()
            {
                UserId = loggedUserId,
                TotalPrice = service.CalculateTotalPrice(model.GameIds),
                StatusId = service.GetStatusId("Pending"),
                ShippingAddress = model.ShippingAddress
            };

            service.Save(item);

            foreach (var gameId in model.GameIds)
            {
                var orderGame = new OrderGame()
                {
                    GameId = gameId,
                    OrderId = item.Id
                };

                service.SaveOrderGame(orderGame);
            }

            var response = MapOrderResponseDTO(item);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id}")]
        public IActionResult Put([FromRoute] int id, [FromBody] OrderRequest model)
        {
            OrderServices service = new OrderServices();
            int loggedUserId = int.Parse(User.FindFirst("loggedUserId").Value);

            Order forUpdate = service.GetById(id);
            if (forUpdate == null)
            {
                return NotFound("Order with this id does not exist!");
            }

            if (!User.HasClaim("isAdmin", "True"))
            {
                if (forUpdate.UserId != loggedUserId)
                {
                    return Forbid("Invalid permissions. Admin access required.");
                }

                if (model.Status == "Cancelled")
                {
                    forUpdate.StatusId = service.GetStatusId("Cancelled");
                    var response = MapOrderResponseDTO(forUpdate);
                    return Ok(response);
                }

                service.DeleteOrderGame(forUpdate.Id);

                forUpdate.TotalPrice = service.CalculateTotalPrice(model.GameIds);
                forUpdate.ShippingAddress = model.ShippingAddress;

                foreach (var gameId in model.GameIds)
                {
                    var orderGame = new OrderGame()
                    {
                        GameId = gameId,
                        OrderId = forUpdate.Id
                    };

                    service.SaveOrderGame(orderGame);
                }

                service.Save(forUpdate);


                var response2 = MapOrderResponseDTO(forUpdate);
                return Ok(response2);
            }
            else
            {
                if (model.Status == "Cancelled")
                {
                    forUpdate.StatusId = service.GetStatusId("Cancelled");
                    var response = MapOrderResponseDTO(forUpdate);
                    return Ok(response);
                }
                if (model.Status == "Completed")
                {
                    forUpdate.StatusId = service.GetStatusId("Completed");
                    var response = MapOrderResponseDTO(forUpdate);
                    return Ok(response);
                }

                if (loggedUserId == forUpdate.UserId)
                {
                    service.DeleteOrderGame(forUpdate.Id);

                    forUpdate.TotalPrice = service.CalculateTotalPrice(model.GameIds);
                    forUpdate.ShippingAddress = model.ShippingAddress;

                    foreach (var gameId in model.GameIds)
                    {
                        var orderGame = new OrderGame()
                        {
                            GameId = gameId,
                            OrderId = forUpdate.Id
                        };

                        service.SaveOrderGame(orderGame);
                    }
                }

                service.Save(forUpdate);

                var response2 = MapOrderResponseDTO(forUpdate);
                return Ok(response2);
            }
        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete([FromRoute] int id)
        {
            OrderServices service = new OrderServices();
            Order forDelete = service.GetById(id);
            if (forDelete == null)
            {
                return NotFound("Order with this id does not exist!");
            }

            int loggedUserId = int.Parse(User.FindFirst("loggedUserId").Value);

            if (!User.HasClaim("isAdmin", "True"))
            {
                if (loggedUserId != forDelete.UserId)
                {
                    return Forbid("Invalid permissions. Admin access required.");
                }

                service.DeleteOrderGame(forDelete.Id);
                service.Delete(forDelete);
            }
            else
            {
                service.DeleteOrderGame(forDelete.Id);
                service.Delete(forDelete);
            }

            var response = MapOrderResponseDTO(forDelete);
            return Ok(response);
        }

        private OrderResponse MapOrderResponseDTO(Order order)
        {
            var gameIds = new List<int>();
            if (order.OrderGames != null)
            {
                gameIds = order.OrderGames.Select(og => og.GameId).ToList();
            }

            return new OrderResponse()
            {
                Id = order.Id,
                UserId = order.UserId,
                TotalPrice = order.TotalPrice,
                StatusId = order.StatusId,
                ShippingAddress = order.ShippingAddress,
                GameIds = gameIds
            };
        }
    }
}
