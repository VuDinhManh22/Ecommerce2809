// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

using System.Security.Claims;

namespace Application.Services.Externals;

public interface IRoleClaimService
{
    Task<List<Claim>> GetClaimListByUserAsync(
        string userId,
        CancellationToken cancellationToken = default);
    Task<List<Claim>> GetClaimListAsync(
        CancellationToken cancellationToken = default);

}

