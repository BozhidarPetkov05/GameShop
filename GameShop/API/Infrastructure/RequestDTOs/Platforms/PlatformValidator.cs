using System;
using FluentValidation;

namespace API.Infrastructure.RequestDTOs.Platforms;

public class PlatformValidator : AbstractValidator<PlatformRequest>
{
    public PlatformValidator()
    {
        RuleFor(p => p.Name)
            .NotEmpty().WithMessage("Name is required!")
            .MinimumLength(3).WithMessage("Name must be at least 3 characters long!")
            .MaximumLength(25).WithMessage("Name cannot exceed 30 characters!");
    }
}
