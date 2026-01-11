using System;

namespace Common.Persistance;

public static class Configuration
{
    public static string ConnectionString = @"
                Server=localhost\sqlexpress;
                Database=GameShopDb;
                User Id=asdf;
                Password=asdf;
                TrustServerCertificate=True;";
}
