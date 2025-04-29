// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

namespace Infrastructure.SecurityManagers.RoleClaims;

public class RoleClaimException : Exception
{
    public RoleClaimException() { }

    public RoleClaimException(string message) : base(message) { }

    public RoleClaimException(string message, Exception innerException) : base(message, innerException) { }
}
