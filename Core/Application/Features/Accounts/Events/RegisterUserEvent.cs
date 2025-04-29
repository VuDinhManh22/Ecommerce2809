// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

using MediatR;

namespace Application.Features.Accounts.Events;

public class RegisterUserEvent : INotification
{
    public string Email { get; }
    public string? FirstName { get; }
    public string? LastName { get; }
    public string? EmailConfirmationToken { get; }
    public bool SendEmailConfirmation { get; }
    public string Host { get; }

    public RegisterUserEvent(
        string email,
        string? firstName,
        string? lastName,
        string? emailConfirmationToken,
        bool sendEmailConfirmation,
        string host)
    {
        Email = email;
        FirstName = firstName;
        LastName = lastName;
        EmailConfirmationToken = emailConfirmationToken;
        SendEmailConfirmation = sendEmailConfirmation;
        Host = host;
    }
}

