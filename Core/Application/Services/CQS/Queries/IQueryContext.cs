// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

namespace Application.Services.CQS.Queries;
public interface IQueryContext : IEntityDbSet
{
    IQueryable<T> Set<T>() where T : class;
}