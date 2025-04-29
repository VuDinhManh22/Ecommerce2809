// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

using Application.Features.NavigationManagers.Queries;

namespace Application.Services.Externals;

public interface INavigationService
{
    Task<GetMainNavResult> GenerateMainNavAsync(string userId, CancellationToken cancellationToken = default);
}
