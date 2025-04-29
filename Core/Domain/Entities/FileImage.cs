// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

using Domain.Bases;
using Domain.Interfaces;

namespace Domain.Entities;

public class FileImage : BaseEntityCommon, IAggregateRoot
{

    public string? OriginalName { get; set; }
    public string GeneratedName { get; set; } = null!;
    public string? Extension { get; set; }
    public long FileSize { get; set; }


    public FileImage() : base() { } //for EF Core
    public FileImage(
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
