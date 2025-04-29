// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

namespace Infrastructure.ImageManagers;

public class ImageManagerException : Exception
{
    public ImageManagerException() { }

    public ImageManagerException(string message) : base(message) { }

    public ImageManagerException(string message, Exception innerException) : base(message, innerException) { }
}
