// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

namespace Domain.Bases;

/// <summary>
/// Base class for advanced entities that extends <see cref="BaseEntityAudit"/>.
/// Adds properties for code, name, and an optional description, typically used for more complex entities that require both a code and a name.
/// </summary>
public abstract class BaseEntityAdvance : BaseEntityAudit
{
    public string Code { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? Description { get; set; }

    protected BaseEntityAdvance() { } // for EF Core
    protected BaseEntityAdvance(
        string? userId,
        string code,
        string name,
        string? description
        ) : base(userId)
    {
        Code = code.Trim();
        Name = name.Trim();
        Description = description?.Trim();
    }
}
