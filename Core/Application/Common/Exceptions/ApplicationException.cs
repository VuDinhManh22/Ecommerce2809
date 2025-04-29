// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------


namespace Application.Common.Exceptions;

public class ApplicationException : Exception
{
    public ApplicationException() { }

    public ApplicationException(string message) : base(message) { }

    public ApplicationException(string message, Exception innerException) : base(message, innerException) { }
}
