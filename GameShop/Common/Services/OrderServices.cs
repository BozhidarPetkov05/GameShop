using System;
using System.Collections.Generic;
using System.Linq;
using Common.Entities;

namespace Common.Services;

public class OrderServices : BaseService<Order>
{
    public decimal CalculateTotalPrice(List<int> gameIds)
    {
        decimal totalPrice = Context.Set<Game>()
            .Where(g => gameIds.Contains(g.Id))
            .Sum(g => g.Price);

        return totalPrice;
    }

    public int GetStatusId(string name)
    {

        return Context.Set<Status>()
          .Where(s => s.Name == name)
          .Select(s => s.Id)
          .FirstOrDefault();

    }

    public void SaveOrderGame(OrderGame og)
    {
        Context.Set<OrderGame>().Add(og);
        Context.SaveChanges();
    }

    public void DeleteOrderGame(int id)
    {
        var orderGames = Context.Set<OrderGame>().Where(og => og.OrderId == id).ToList();
        foreach (var orderGame in orderGames)
        {
            Context.Set<OrderGame>().Remove(orderGame);
        }
        Context.SaveChanges();
    }

    public List<int> GetGameIds(List<string> titles)
    {
        return Context.Set<Game>()
            .Where(g => titles.Contains(g.Title))
            .Select(g => g.Id)
            .ToList();
    }

    public List<string> GetGameNames(List<int> ids)
    {
        if (ids == null || ids.Count == 0)
        {
            return new List<string>();
        }

        return Context.Set<Game>()
            .Where(g => ids.Contains(g.Id))
            .Select(g => g.Title)
            .ToList();
    }
}
