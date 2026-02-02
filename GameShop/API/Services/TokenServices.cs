using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Common.Entities;
using Microsoft.IdentityModel.Tokens;

namespace API.Services;

public class TokenServices
{
    public string CreateToken(User user)
    {
        Claim[] claims = new Claim[]
        {
            new Claim("loggedUserId", user.Id.ToString()),
            new Claim("isAdmin", user.IsAdmin.ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("SuperTurboMegaPUSecretKey!123!PU123!PU123!"));
        var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        //TODO: Change issuer and audience
        JwtSecurityToken token = new JwtSecurityToken(
            issuer: "pu-fmi",
            audience: "web-api-game-shop",
            claims: claims,
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: cred
        );
        string tokenData = new JwtSecurityTokenHandler()
                                            .WriteToken(token);

        return tokenData;
    }
}
