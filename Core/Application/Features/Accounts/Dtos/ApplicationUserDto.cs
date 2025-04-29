// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

namespace Application.Features.Accounts.Dtos;

public class ApplicationUserDto
{
    public string? Id { get; set; }
    public string? UserId { get; init; }
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
    public string? Email { get; init; }
    public string? ProfilePictureName { get; init; }
    public bool EmailConfirmed { get; init; }
    public bool IsBlocked { get; init; }
    public bool IsDeleted { get; init; }
    public IList<string> Roles { get; set; } = new List<string>();
    public IList<string> Claims { get; set; } = new List<string>();
}
