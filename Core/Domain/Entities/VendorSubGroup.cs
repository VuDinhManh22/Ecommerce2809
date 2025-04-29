// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

using Domain.Bases;
using Domain.Interfaces;

namespace Domain.Entities;

public class VendorSubGroup : BaseEntityCommon, IEntity
{

    public string VendorGroupId { get; set; } = null!;


    public VendorSubGroup() : base() { } //for EF Core
    internal VendorSubGroup(
        string? userId,
        string vendorGroupId,
        string name,
        string? description
        ) : base(userId, name, description)
    {
        VendorGroupId = vendorGroupId;
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
