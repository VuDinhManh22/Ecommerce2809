// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

using Domain.Bases;
using Domain.Interfaces;

namespace Domain.Entities;

public class Config : BaseEntityCommon, IAggregateRoot
{
    public string CurrencyId { get; set; } = null!;
    public string SmtpHost { get; set; } = null!;
    public int SmtpPort { get; set; }
    public string SmtpUserName { get; set; } = null!;
    public string SmtpPassword { get; set; } = null!;
    public bool SmtpUseSSL { get; set; }
    public bool Active { get; set; }


    public Config() : base() { } //for EF Core
    public Config(
        string? userId,
        string name,
        string? description,
        string currencyId,
        string smtpHost,
        int smtpPort,
        string smtpUserName,
        string smtpPassword,
        bool smtpUseSSL,
        bool active
        ) : base(userId, name, description)
    {
        CurrencyId = currencyId.Trim();
        SmtpHost = smtpHost.Trim();
        SmtpPort = smtpPort;
        SmtpUserName = smtpUserName.Trim();
        SmtpPassword = smtpPassword.Trim();
        SmtpUseSSL = smtpUseSSL;
        Active = active;
    }


    public void Update(
        string? userId,
        string name,
        string? description,
        string currencyId,
        string smtpHost,
        int smtpPort,
        string smtpUserName,
        string? smtpPassword,
        bool smtpUseSSL,
        bool active
        )
    {
        Name = name.Trim();
        Description = description?.Trim();
        CurrencyId = currencyId.Trim();
        SmtpHost = smtpHost.Trim();
        SmtpPort = smtpPort;
        SmtpUserName = smtpUserName.Trim();
        if (!string.IsNullOrEmpty(smtpPassword?.Trim()))
        {
            SmtpPassword = smtpPassword!.Trim();
        }
        SmtpUseSSL = smtpUseSSL;
        Active = active;

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
