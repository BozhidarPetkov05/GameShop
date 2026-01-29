using System;
using FluentValidation.AspNetCore;
using FluentValidation;
using Microsoft.AspNetCore.Mvc.Diagnostics;

namespace API.Infrastructure.RequestDTOs.Games;

public class GameValidator : AbstractValidator<GameRequest>
{
    public GameValidator()
    {
        RuleFor(g => g.Title)
            .NotEmpty().WithMessage("Title is required!")
            .MinimumLength(3).WithMessage("Title must be at least 3 characters long!")
            .MaximumLength(30).WithMessage("Title cannot exceed 30 characters!");

        RuleFor(g => g.Price)
            .NotEmpty().WithMessage("Price is required!")
            .GreaterThan(0).WithMessage("Price cannot be less than or equal to 0");

        RuleFor(g => g.Description)
            .NotEmpty().WithMessage("Description is required!")
            .MinimumLength(3).WithMessage("Description must be at least 3 characters long!")
            .MaximumLength(700).WithMessage("Description cannot exceed 700 characters!");

        RuleFor(g => g.Genre)
            .NotEmpty().WithMessage("Genre is required!");

        RuleFor(g => g.Company)
            .NotEmpty().WithMessage("Company is required!");

        RuleFor(g => g.Platforms)
            .Must(list => list.Count > 0).WithMessage("Select at least one platform!");

        RuleFor(g => g.Tags)
            .Must(list => list.Count > 0).WithMessage("Select at least one tag!");
    }
}
