using System;
using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidIssuer = "pu-fmi",
            ValidAudience = "web-api-game-shop",
            IssuerSigningKey =
                        new SymmetricSecurityKey(Encoding.ASCII.GetBytes("SuperTurboMegaPUSecretKey!123!PU123!PU123!"))
        };
    });

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

var app = builder.Build();

app.UseCors();

// app.UseExceptionHandler(errorApp =>
// {
//     errorApp.Run(async context =>
//     {
//         if (!context.Response.Headers.ContainsKey("Access-Control-Allow-Origin"))
//         {
//             context.Response.Headers["Access-Control-Allow-Origin"] = "*";
//             context.Response.Headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS";
//             context.Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
//         }
//         context.Response.StatusCode = 500;
//         context.Response.ContentType = "application/json";
//         await context.Response.WriteAsJsonAsync(new { error = "Internal server error" });
//     });
// });

// app.Use(async (context, next) =>
// {
//     if (context.Request.Method == "OPTIONS")
//     {
//         context.Response.StatusCode = 200;
//         await context.Response.CompleteAsync();
//         return;
//     }
//     await next();
// });

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
