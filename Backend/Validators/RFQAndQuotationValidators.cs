using FluentValidation;
using Backend.DTOs;

namespace Backend.Validators;

public class CreateRFQDtoValidator : AbstractValidator<CreateRFQDto>
{
    public CreateRFQDtoValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Deadline).GreaterThan(DateTime.UtcNow);
        RuleFor(x => x.Items).NotEmpty().WithMessage("RFQ must have at least one item");
        RuleForEach(x => x.Items).SetValidator(new CreateRFQItemDtoValidator());
    }
}

public class CreateRFQItemDtoValidator : AbstractValidator<CreateRFQItemDto>
{
    public CreateRFQItemDtoValidator()
    {
        RuleFor(x => x.ItemName).NotEmpty();
        RuleFor(x => x.Quantity).GreaterThan(0);
    }
}

public class SubmitQuotationDtoValidator : AbstractValidator<SubmitQuotationDto>
{
    public SubmitQuotationDtoValidator()
    {
        RuleFor(x => x.RFQId).GreaterThan(0);
        RuleFor(x => x.Items).NotEmpty();
        RuleForEach(x => x.Items).SetValidator(new SubmitQuotationItemDtoValidator());
    }
}

public class SubmitQuotationItemDtoValidator : AbstractValidator<SubmitQuotationItemDto>
{
    public SubmitQuotationItemDtoValidator()
    {
        RuleFor(x => x.ItemId).GreaterThan(0);
        RuleFor(x => x.UnitPrice).GreaterThan(0);
        RuleFor(x => x.DeliveryDays).GreaterThan(0);
    }
}