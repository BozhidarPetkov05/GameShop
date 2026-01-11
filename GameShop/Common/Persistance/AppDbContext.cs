using System;
using Common.Entities;
using Common.Persistance;
using Microsoft.EntityFrameworkCore;

namespace Common;

public class AppDbContext : DbContext
{
    public DbSet<Company> Companies { get; set; }
    public DbSet<Game> Games { get; set; }
    public DbSet<GamePlatform> GamePlatforms { get; set; }
    public DbSet<GameTag> GameTags { get; set; }
    public DbSet<Genre> Genres { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderGame> OrderGames { get; set; }
    public DbSet<Platform> Platforms { get; set; }
    public DbSet<Status> Statuses { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<User> Users { get; set; }

    override protected void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder
            .UseLazyLoadingProxies()
            .UseSqlServer(Configuration.ConnectionString);
    }


}
