// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

namespace Infrastructure.DataAccessManagers.EFCores.Exceptions;

public class ODataException : Exception
{
    public ODataException() { }

    public ODataException(string message) : base(message) { }

    public ODataException(string message, Exception innerException) : base(message, innerException) { }
}

