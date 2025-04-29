// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

using Domain.Bases;
using Domain.Interfaces;

namespace Domain.Entities;

public class Currency : BaseEntityCommon, IAggregateRoot
{
    public string Symbol { get; set; } = null!;

    public Currency() : base() { } //for EF Core
    public Currency(
        string? userId,
        string name,
        string symbol,
        string? description
        ) : base(userId, name, description)
    {
        Symbol = symbol;
    }

    public void Update(
        string? userId,
        string name,
        string symbol,
        string? description
        )
    {
        Name = name.Trim();
        Symbol = symbol.Trim();
        Description = description?.Trim();

        SetAudit(userId);
    }

    public void Delete(
        string? userId
        )
    {
        SetAsDeleted();
        SetAudit(userId);
    }

}
