// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

using Domain.Bases;
using Domain.Interfaces;

namespace Domain.Entities;

public class CustomerSubGroup : BaseEntityCommon, IEntity
{

    public string CustomerGroupId { get; set; } = null!;


    public CustomerSubGroup() : base() { } //for EF Core
    internal CustomerSubGroup(
        string? userId,
        string customerGroupId,
        string name,
        string? description
        ) : base(userId, name, description)
    {
        CustomerGroupId = customerGroupId;
    }


    internal void Update(
        string? userId,
        string name,
        string? description
        )
    {
        Name = name.Trim();
        Description = description?.Trim();

        SetAudit(userId);
    }

    internal void Delete(
        string? userId
        )
    {
        SetAsDeleted();
        SetAudit(userId);
    }
}
