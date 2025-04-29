// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

using Domain.Bases;
using Domain.Interfaces;

namespace Domain.Entities;

public class FileDoc : BaseEntityCommon, IAggregateRoot
{

    public string? OriginalName { get; set; }
    public string GeneratedName { get; set; } = null!;
    public string? Extension { get; set; }
    public long FileSize { get; set; }


    public FileDoc() : base() { } //for EF Core
    public FileDoc(
        string? userId,
        string name,
        string? description,
        string? originalName,
        string generatedName,
        string? extension,
        long fileSize
    ) : base(userId, name, description)
    {
        OriginalName = originalName?.Trim();
        GeneratedName = generatedName.Trim();
        Extension = extension?.Trim();
        FileSize = fileSize;
    }

}
