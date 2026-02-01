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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        #region User
        modelBuilder.Entity<User>()
            .HasKey(u => u.Id);

        modelBuilder.Entity<User>()
            .HasData(new User
            {
                Id = 1,
                Username = "admin",
                Password = "admin",
                FirstName = "Admin",
                LastName = "Admin",
                IsAdmin = true
            });
        #endregion

        #region Company
        modelBuilder.Entity<Company>()
            .HasKey(c => c.Id);
        #endregion

        #region Game
        modelBuilder.Entity<Game>()
            .HasKey(g => g.Id);

        modelBuilder.Entity<Game>()
            .HasOne(g => g.Genre)
            .WithMany(g => g.Games)
            .HasForeignKey(g => g.GenreId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Game>()
            .HasOne(g => g.Company)
            .WithMany(g => g.Games)
            .HasForeignKey(g => g.CompanyId)
            .OnDelete(DeleteBehavior.Restrict);

        #endregion

        #region GamePlatform
        modelBuilder.Entity<GamePlatform>()
            .HasKey(gp => new { gp.GameId, gp.PlatformId });

        modelBuilder.Entity<GamePlatform>()
            .HasOne(gp => gp.Game)
            .WithMany(gp => gp.GamePlatforms)
            .HasForeignKey(gp => gp.GameId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<GamePlatform>()
            .HasOne(gp => gp.Platform)
            .WithMany(gp => gp.GamePlatforms)
            .HasForeignKey(gp => gp.PlatformId)
            .OnDelete(DeleteBehavior.Restrict);

        #endregion

        #region GameTag
        modelBuilder.Entity<GameTag>()
            .HasKey(gt => new { gt.GameId, gt.TagId });

        modelBuilder.Entity<GameTag>()
            .HasOne(gt => gt.Game)
            .WithMany(gt => gt.GameTags)
            .HasForeignKey(gt => gt.GameId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<GameTag>()
            .HasOne(gt => gt.Tag)
            .WithMany(gt => gt.GameTags)
            .HasForeignKey(gt => gt.TagId)
            .OnDelete(DeleteBehavior.Restrict);
        #endregion

        #region Genre
        modelBuilder.Entity<Genre>()
            .HasKey(g => g.Id);
        #endregion

        #region Order
        modelBuilder.Entity<Order>()
            .HasKey(o => o.Id);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.User)
            .WithMany(o => o.Orders)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.Status)
            .WithMany(o => o.Orders)
            .HasForeignKey(o => o.StatusId)
            .OnDelete(DeleteBehavior.Restrict);
        #endregion

        #region OrderGame
        modelBuilder.Entity<OrderGame>()
            .HasKey(og => new { og.OrderId, og.GameId });

        modelBuilder.Entity<OrderGame>()
            .HasOne(og => og.Order)
            .WithMany(og => og.OrderGames)
            .HasForeignKey(og => og.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<OrderGame>()
            .HasOne(og => og.Game)
            .WithMany(og => og.OrderGames)
            .HasForeignKey(og => og.GameId)
            .OnDelete(DeleteBehavior.Restrict);
        #endregion

        #region Platform
        modelBuilder.Entity<Platform>()
            .HasKey(p => p.Id);
        #endregion

        #region Status
        modelBuilder.Entity<Status>()
            .HasKey(s => s.Id);
        #endregion

        #region Tag
        modelBuilder.Entity<Tag>()
            .HasKey(t => t.Id);
        #endregion
    }
}
