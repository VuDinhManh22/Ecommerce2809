// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

namespace Domain.Interfaces;

/// <summary>
/// Interface to indicate that an entity has a deletion status.
/// This is commonly used to mark an entity as soft-deleted without physically removing it from the database.
/// </summary>
public interface IHasIsDeleted
{
    bool IsDeleted { get; }
}
