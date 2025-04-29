// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

using Infrastructure.SecurityManagers.AspNetIdentity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.SeedManagers.Demos;

public class UserSeeder
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UserSeeder(
        UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task GenerateDataAsync()
    {
        var staffRole = "Staff";
        var basicRole = "Basic";

        var users = new List<(string FirstName, string LastName, string Email, string Password)>
            {
                ("Alex", "Taylor", "alex.taylor@example.com", "123456"),
                ("Jordan", "Morgan", "jordan.morgan@example.com", "123456"),
                ("Taylor", "Lee", "taylor.lee@example.com", "123456"),
                ("Cameron", "Drew", "cameron.drew@example.com", "123456"),
                ("Casey", "Reese", "casey.reese@example.com", "123456"),
                ("Skyler", "Morgan", "skyler.morgan@example.com", "123456"),
                ("Avery", "Quinn", "avery.quinn@example.com", "123456"),
                ("Charlie", "Harper", "charlie.harper@example.com", "123456"),
                ("Jamie", "Riley", "jamie.riley@example.com", "123456"),
                ("Riley", "Jordan", "riley.jordan@example.com", "123456"),
            };

        foreach (var (firstName, lastName, email, password) in users)
        {
            if (await _userManager.FindByEmailAsync(email) == null)
            {
                var applicationUser = new ApplicationUser(
                    email,
                    firstName,
                    lastName,
                    null
                );

                applicationUser.EmailConfirmed = true;

                await _userManager.CreateAsync(applicationUser, password);

                if (!await _userManager.IsInRoleAsync(applicationUser, staffRole))
                {
                    await _userManager.AddToRoleAsync(applicationUser, staffRole);
                }
                if (!await _userManager.IsInRoleAsync(applicationUser, basicRole))
                {
                    await _userManager.AddToRoleAsync(applicationUser, basicRole);
                }
            }
        }
    }
}
