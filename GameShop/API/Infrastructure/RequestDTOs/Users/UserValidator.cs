using System;
using FluentValidation;
using Microsoft.Identity.Client;

namespace API.Infrastructure.RequestDTOs.Users;

public class UserValidator : AbstractValidator<UserRequest>
{
    public UserValidator()
    {
        RuleFor(u => u.Username)
            .NotEmpty().WithMessage("Username is required!")
            .MinimumLength(3).WithMessage("Username must be at least 3 characters long!")
            .MaximumLength(30).WithMessage("Username cannot exceed 30 characters!");

        RuleFor(u => u.Email)
            .NotEmpty().WithMessage("Email is required!")
            .EmailAddress().WithMessage("Email is invalid!");

        RuleFor(u => u.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters long")
            .MaximumLength(60).WithMessage("Password cannot exceed 60 characters!");

        RuleFor(u => u.FirstName)
            .NotEmpty().WithMessage("First name is required!")
            .MinimumLength(3).WithMessage("First name must be at least 3 characters long!")
            .MaximumLength(30).WithMessage("First name cannot exceed 30 characters!");

        RuleFor(u => u.LastName)
            .NotEmpty().WithMessage("Last name is required!")
            .MinimumLength(3).WithMessage("Last name must be at least 3 characters long!")
            .MaximumLength(30).WithMessage("Last name cannot exceed 30 characters!");
    }
}
