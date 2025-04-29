// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

namespace Infrastructure.SecurityManagers.Navigations;

public class NavigationException : Exception
{
    public NavigationException() { }

    public NavigationException(string message) : base(message) { }

    public NavigationException(string message, Exception innerException) : base(message, innerException) { }
}
