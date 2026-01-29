using System;
using FluentValidation;

namespace API.Infrastructure.RequestDTOs.Orders;

public class OrderValidator : AbstractValidator<OrderRequest>
{
    public OrderValidator()
    {
        RuleFor(o => o.ShippingAddress)
            .NotEmpty().WithMessage("Shipping address is required!")
            .MinimumLength(3).WithMessage("Shipping address must be at least 3 characters long!");

        RuleFor(o => o.Games)
            .Must(list => list.Count > 0).WithMessage("Select at least one game!");
    }
}
