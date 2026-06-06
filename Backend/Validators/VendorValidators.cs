using FluentValidation;
using Backend.DTOs;

namespace Backend.Validators;

public class CreateVendorDtoValidator : AbstractValidator<CreateVendorDto>
{
    public CreateVendorDtoValidator()
    {
        RuleFor(x => x.CompanyName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.GstNumber).NotEmpty().Matches(@"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")
            .WithMessage("Invalid GST Number format");
        RuleFor(x => x.Category).NotEmpty();
        RuleFor(x => x.ContactPerson).NotEmpty();
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Phone).NotEmpty().Matches(@"^\d{10}$").WithMessage("Phone number must be 10 digits");
    }
}

public class UpdateVendorStatusDtoValidator : AbstractValidator<UpdateVendorStatusDto>
{
    public UpdateVendorStatusDtoValidator()
    {
        RuleFor(x => x.Status).NotEmpty().Must(s => new[] { "ACTIVE", "BLOCKED", "PENDING" }.Contains(s.ToUpper()))
            .WithMessage("Invalid status");
    }
}