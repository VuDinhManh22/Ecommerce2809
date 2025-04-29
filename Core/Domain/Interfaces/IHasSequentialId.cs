// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

namespace Domain.Interfaces;

/// <summary>
/// Interface to indicate that an entity will have a sequential Id.
/// The Id will be a sequential GUID stored as a string, ensuring ordered insertions
/// and better performance for indexed queries in databases.
/// </summary>
public interface IHasSequentialId
{
    string Id { get; set; }
}


