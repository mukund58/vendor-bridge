using FluentValidation;
using Backend.DTOs;

namespace Backend.Validators;

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty();
    }
}

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(50);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Phone).NotEmpty().Matches(@"^\d{10}$").WithMessage("Phone number must be 10 digits");
        RuleFor(x => x.Country).NotEmpty();
        RuleFor(x => x.Role).NotEmpty().Must(r => new[] { "ADMIN", "PROCUREMENT_OFFICER", "MANAGER", "VENDOR" }.Contains(r.ToUpper()))
            .WithMessage("Invalid role");
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
    }
}