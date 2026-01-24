using System;
using FluentValidation;

namespace API.Infrastructure.RequestDTOs.Auth;

public class AuthTokenValidator : AbstractValidator<AuthTokenRequest>
{
    public AuthTokenValidator()
    {
        RuleFor(a => a.Username)
            .NotEmpty().WithMessage("Username is required!")
            .MinimumLength(4).WithMessage("Username must be at least 4 characters long!");

        RuleFor(a => a.Password)
            .NotEmpty().WithMessage("Password is required!")
            .MinimumLength(4).WithMessage("Password must be at least 4 characters long!");
    }
}
