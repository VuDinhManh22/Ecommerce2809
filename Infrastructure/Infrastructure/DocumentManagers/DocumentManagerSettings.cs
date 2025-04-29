// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

namespace Infrastructure.DocumentManagers;

public class DocumentManagerSettings
{
    public string PathFolder { get; set; } = string.Empty;
    public int MaxFileSizeInMB { get; set; }
}
