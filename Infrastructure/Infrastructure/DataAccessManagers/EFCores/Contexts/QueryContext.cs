// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

using Application.Services.CQS.Queries;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.DataAccessManagers.EFCores.Contexts;

public class QueryContext : DataContext, IQueryContext
{
    public QueryContext(DbContextOptions<DataContext> options)
        : base(options)
    {
    }

    public new IQueryable<T> Set<T>() where T : class
    {
        return base.Set<T>();
    }
}
