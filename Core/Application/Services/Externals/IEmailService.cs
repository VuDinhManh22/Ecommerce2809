// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

namespace Application.Services.Externals;

public interface IEmailService
{
    Task SendEmailAsync(string email, string subject, string htmlMessage);

}
