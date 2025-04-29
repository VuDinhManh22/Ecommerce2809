// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

namespace Application.Services.CQS.Queries;

public interface IODataQueryOptions<T>
{
    IQueryable<T> ApplyOData(IQueryable<T> query);
    IQueryable<T> ApplySorting(IQueryable<T> query);
    IQueryable<T> ApplyFilter(IQueryable<T> query);
    IQueryable<T> ApplyPaging(IQueryable<T> query);
    int GetTotalRecords(IQueryable<T> query);
    int GetSkip();
    int GetTop();
    string? GetOrderby();
}



