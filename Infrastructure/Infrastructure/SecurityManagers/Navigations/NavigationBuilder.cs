// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

using System.Text.Json;

namespace Infrastructure.SecurityManagers.Navigations
{
    public static class NavigationBuilder
    {
        private static readonly string jsonNavigation = """
        [
          {
            "ParentName": "Dashboard",
            "ParentCaption": "Dashboard",
            "ParentUrl": "#",
            "Children": [
              {
                "Name": "Dashboard",
                "Caption": "Dashboard",
                "Url": "/Dashboards"
              }
            ]
          },
          {
            "ParentName": "ThirdParty",
            "ParentCaption": "Third Party",
            "ParentUrl": "#",
            "Children": [
              {
                "Name": "Customer",
                "Caption": "Customer",
                "Url": "/Customers"
              },
              {
                "Name": "CustomerContact",
                "Caption": "Customer Contact",
                "Url": "/CustomerContacts"
              },
              {
                "Name": "CustomerGroup",
                "Caption": "Customer Group",
                "Url": "/CustomerGroups"
              },
              {
                "Name": "CustomerSubGroup",
                "Caption": "Customer SubGroup",
                "Url": "/CustomerSubGroups"
              },
              {
                "Name": "Vendor",
                "Caption": "Vendor",
                "Url": "/Vendors"
              },
              {
                "Name": "VendorContact",
                "Caption": "Vendor Contact",
                "Url": "/VendorContacts"
              },
              {
                "Name": "VendorGroup",
                "Caption": "Vendor Group",
                "Url": "/VendorGroups"
              },
              {
                "Name": "VendorSubGroup",
                "Caption": "Vendor SubGroup",
                "Url": "/VendorSubGroups"
              }
            ]
          },
          {
            "ParentName": "Settings",
            "ParentCaption": "Settings",
            "ParentUrl": "#",
            "Children": [
              {
                "Name": "Config",
                "Caption": "Config",
                "Url": "/Configs"
              },
              {
                "Name": "Currency",
                "Caption": "Currency",
                "Url": "/Currencies"
              },
              {
                "Name": "Gender",
                "Caption": "Gender",
                "Url": "/Genders"
              }
            ]
          },
          {
            "ParentName": "Profile",
            "ParentCaption": "Profile",
            "ParentUrl": "#",
            "Children": [
              {
                "Name": "UserProfile",
                "Caption": "User Profile",
                "Url": "/UserProfiles"
              }
            ]
          },
          {
            "ParentName": "RoleMembership",
            "ParentCaption": "Role & Membership",
            "ParentUrl": "#",
            "Children": [
              {
                "Name": "Role",
                "Caption": "Role",
                "Url": "/Roles"
              },
              {
                "Name": "Claim",
                "Caption": "Claim",
                "Url": "/Claims"
              },
              {
                "Name": "Member",
                "Caption": "Member",
                "Url": "/Members"
              }
            ]
          }
        ]
        """;



        public static List<NavigationContributor> BuildFinalNavigations()
        {
            var contributors = JsonSerializer.Deserialize<List<NavigationContributor>>(jsonNavigation, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            return contributors ?? new List<NavigationContributor>();
        }
    }
}
