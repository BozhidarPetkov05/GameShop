using System;
using FluentValidation;

namespace API.Infrastructure.RequestDTOs.Tags;

public class TagValidator : AbstractValidator<TagRequest>
{
    public TagValidator()
    {
        RuleFor(t => t.Name)
            .NotEmpty().WithMessage("Name is required!")
            .MinimumLength(3).WithMessage("Name must be at least 3 characters long!")
            .MaximumLength(30).WithMessage("Name cannot exceed 30 characters!");
    }
}
