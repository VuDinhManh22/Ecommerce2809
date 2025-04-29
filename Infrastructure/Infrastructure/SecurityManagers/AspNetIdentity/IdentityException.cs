// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

namespace Infrastructure.SecurityManagers.AspNetIdentity;

public class IdentityException : Exception
{
    public IdentityException() { }

    public IdentityException(string message) : base(message) { }

    public IdentityException(string message, Exception innerException) : base(message, innerException) { }
}
