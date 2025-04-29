// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

namespace Infrastructure.DataAccessManagers.EFCores.Exceptions;

public class RepositoryException : Exception
{
    public RepositoryException() { }

    public RepositoryException(string message) : base(message) { }

    public RepositoryException(string message, Exception innerException) : base(message, innerException) { }
}
