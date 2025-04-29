// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

using Domain.Bases;
using Domain.Interfaces;

namespace Application.Services.Repositories;

public interface IBaseCommandRepository<T> where T : BaseEntity, IAggregateRoot
{
    Task CreateAsync(T entity, CancellationToken cancellationToken = default);

    void Create(T entity);

    void Update(T entity);

    void Delete(T entity);

    void Purge(T entity);

    Task<T?> GetAsync(string id, CancellationToken cancellationToken = default);

    T? Get(string id);

    IQueryable<T> GetQuery();
}
