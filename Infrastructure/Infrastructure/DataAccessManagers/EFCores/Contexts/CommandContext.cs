// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

using Application.Services.CQS.Commands;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.DataAccessManagers.EFCores.Contexts;

public class CommandContext : DataContext, ICommandContext
{
    public CommandContext(DbContextOptions<DataContext> options)
        : base(options)
    {
    }
}
