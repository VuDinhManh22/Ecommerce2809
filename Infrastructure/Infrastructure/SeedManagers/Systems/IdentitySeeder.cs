// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

using Infrastructure.SecurityManagers.AspNetIdentity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace Infrastructure.SeedManagers.Systems;

public class IdentitySeeder
{
    private readonly IdentitySettings _identitySettings;
    private readonly UserManager<ApplicationUser> _userManager;

    public IdentitySeeder(
        IOptions<IdentitySettings> identitySettings,
        UserManager<ApplicationUser> userManager)
    {
        _identitySettings = identitySettings.Value;
        _userManager = userManager;
    }
    public async Task GenerateDataAsync()
    {
        var adminEmail = _identitySettings.DefaultAdmin.Email;
        var adminPassword = _identitySettings.DefaultAdmin.Password;

        var adminRole = "Admin";
        var basicRole = "Basic";
        if (await _userManager.FindByEmailAsync(adminEmail) == null)
        {
            var applicationUser = new ApplicationUser(
                adminEmail,
                "Root",
                "Admin",
                null
                );

            applicationUser.EmailConfirmed = true;

            //create user Root Admin
            await _userManager.CreateAsync(applicationUser, adminPassword);

            //add Admin role to Root Admin
            if (!await _userManager.IsInRoleAsync(applicationUser, adminRole))
            {
                await _userManager.AddToRoleAsync(applicationUser, adminRole);
            }

            //add Basic role to Root Admin
            if (!await _userManager.IsInRoleAsync(applicationUser, basicRole))
            {
                await _userManager.AddToRoleAsync(applicationUser, basicRole);
            }

        }
    }
}
