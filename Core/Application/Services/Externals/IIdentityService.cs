// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

using Application.Common.Models;
using Application.Features.Accounts.Commands;
using Application.Features.Accounts.Queries;
using Application.Features.Members.Commands;

namespace Application.Services.Externals;

public interface IIdentityService
{
    Task<string?> GetUserNameAsync(
        string userId,
        CancellationToken cancellationToken = default);

    Task<bool> IsInRoleAsync(
        string userId,
        string role,
        CancellationToken cancellationToken = default);

    Task<bool> AuthorizeAsync(
        string userId,
        string policyName,
        CancellationToken cancellationToken = default);

    Task<CreateUserResult> CreateUserAsync(
        string email,
        string password,
        string firstName,
        string lastName,
        string creatorUserId,
        CancellationToken cancellationToken = default);

    Task<RegisterUserResult> RegisterUserAsync(
        string email,
        string password,
        string firstName,
        string lastName,
        CancellationToken cancellationToken = default);

    Task<CreateMemberResult> CreateMemberAsync(
        string email,
        string password,
        string firstName,
        string lastName,
        bool emailConfirmed,
        bool isBlocked,
        string[]? roles,
        CancellationToken cancellationToken = default);

    Task<UpdateMemberResult> UpdateMemberAsync(
        string email,
        string? password,
        string firstName,
        string lastName,
        bool emailConfirmed,
        bool isBlocked,
        bool isDeleted,
        string[]? roles,
        CancellationToken cancellationToken = default);

    Task<string> UpdateProfilePictureAsync(
        string email,
        string profilePictureName,
        CancellationToken cancellationToken = default);

    Task<DeleteMemberResult> DeleteMemberAsync(
        string email,
        CancellationToken cancellationToken = default);

    Task<DeleteUserResult> DeleteUserAsync(
        string userId,
        CancellationToken cancellationToken = default);

    Task<LoginUserResult> LoginAsync(
        string email,
        string password,
        CancellationToken cancellationToken = default);

    Task<LogoutUserResult> LogoutAsync(
        string userId,
        CancellationToken cancellationToken = default);

    Task<GenerateRefreshTokenResult> RefreshTokenAsync(
        string refreshToken,
        CancellationToken cancellationToken = default);

    Task<AddRolesToUserResult> AddRolesToUserAsync(
        string userId,
        string[] roles,
        CancellationToken cancellationToken = default);

    Task<DeleteRolesFromUserResult> DeleteRolesFromUserAsync(
        string userId,
        string[] roles,
        CancellationToken cancellationToken = default);

    Task<GetClaimsByUserResult> GetClaimsByUserAsync(
        string userId,
        int page = 1,
        int limit = 10,
        string sortBy = "Value",
        string sortDirection = "asc",
        string searchValue = "",
        CancellationToken cancellationToken = default);

    Task<GetClaimsResult> GetClaimsAsync(
        int page = 1,
        int limit = 10,
        string sortBy = "Value",
        string sortDirection = "asc",
        string searchValue = "",
        CancellationToken cancellationToken = default);

    Task<List<LookupDto>> GetClaimLookupAsync(CancellationToken cancellationToken = default);

    Task<GetClaimsByRoleResult> GetClaimsByRoleAsync(
        string role,
        int page = 1,
        int limit = 10,
        CancellationToken cancellationToken = default);

    Task<GetRolesByUserResult> GetRolesByUserAsync(
        string userId,
        int page = 1,
        int limit = 10,
        CancellationToken cancellationToken = default);

    Task<AddClaimsToRoleResult> AddClaimsToRoleAsync(
        string role,
        string[] claims,
        CancellationToken cancellationToken = default);

    Task<DeleteClaimsFromRoleResult> DeleteClaimsFromRoleAsync(
        string role,
        string[] claims,
        CancellationToken cancellationToken = default);

    Task<CreateRoleResult> CreateRoleAsync(
        string role,
        string[] claims,
        CancellationToken cancellationToken = default);

    Task<DeleteRoleResult> DeleteRoleAsync(
        string role,
        CancellationToken cancellationToken = default);

    Task<UpdateRoleResult> UpdateRoleAsync(
        string oldRole,
        string newRole,
        string[] newClaims,
        CancellationToken cancellationToken = default);

    Task<GetRolesResult> GetRolesAsync(
        int page = 1,
        int limit = 10,
        string sortBy = "Name",
        string sortDirection = "asc",
        string searchValue = "",
        CancellationToken cancellationToken = default);

    Task<GetRoleLookupResult> GetRoleLookupAsync(
        CancellationToken cancellationToken = default);

    Task<GetUsersResult> GetUsersAsync(
        int page = 1,
        int limit = 10,
        string sortBy = "Email",
        string sortDirection = "asc",
        string searchValue = "",
        CancellationToken cancellationToken = default);

    Task<GetUsersByUserIdResult> GetUsersByUserIdAsync(
        string userId,
        CancellationToken cancellationToken = default);

    Task<GetUserByUserIdResult> GetUserByUserIdAsync(
        string userId,
        CancellationToken cancellationToken = default);

    List<string> GetUserIdsByUserName(string userName);

    Dictionary<string, string?> GetUsersDictionary();

    Task<string> ConfirmEmailAsync(
        string email,
        string code,
        CancellationToken cancellationToken = default);

    Task<ForgotPasswordResult> ForgotPasswordAsync(
        string email,
        CancellationToken cancellationToken = default);

    Task<string> ForgotPasswordConfirmationAsync(
        string email,
        string tempPassword,
        string code,
        CancellationToken cancellationToken = default);
}
