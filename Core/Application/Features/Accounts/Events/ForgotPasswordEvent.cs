// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

using MediatR;

namespace Application.Features.Accounts.Events;

public class ForgotPasswordEvent : INotification
{
    public string Email { get; }
    public string TempPassword { get; }
    public string ClearTempPassword { get; }
    public string? EmailConfirmationToken { get; }
    public string Host { get; }

    public ForgotPasswordEvent(
        string email,
        string tempPassword,
        string? emailConfirmationToken,
        string host,
        string clearTempPassword)
    {
        Email = email;
        TempPassword = tempPassword;
        EmailConfirmationToken = emailConfirmationToken;
        Host = host;
        ClearTempPassword = clearTempPassword;
    }
}
