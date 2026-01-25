using System;
using FluentValidation;

namespace API.Infrastructure.RequestDTOs.Companies;

public class CompanyValidator : AbstractValidator<CompanyRequest>
{
    public CompanyValidator()
    {
        RuleFor(c => c.Name)
            .NotEmpty().WithMessage("Name is required!")
            .MinimumLength(3).WithMessage("Name must be at least 3 characters long!")
            .MaximumLength(30).WithMessage("Name cannot exceed 30 characters!");
    }
}
