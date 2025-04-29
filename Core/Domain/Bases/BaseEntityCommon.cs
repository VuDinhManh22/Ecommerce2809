// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

namespace Domain.Bases;

/// <summary>
/// Base class for common entities that extends <see cref="BaseEntityAudit"/> and adds properties for name and description.
/// Used for entities that require basic audit information along with a name and an optional description.
/// </summary>
public abstract class BaseEntityCommon : BaseEntityAudit
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }

    protected BaseEntityCommon() { } // for EF Core
    protected BaseEntityCommon(
        string? userId,
        string name,
        string? description
        ) : base(userId)
    {
        Name = name.Trim();
        Description = description?.Trim();
    }
}
