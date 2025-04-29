// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

namespace Infrastructure.ImageManagers;

public class ImageManagerSettings
{
    public string PathFolder { get; set; } = string.Empty;
    public int MaxFileSizeInMB { get; set; }
}
