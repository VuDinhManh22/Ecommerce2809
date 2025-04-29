// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

using Application.Services.CQS.Queries;
using Application.Services.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.SeedManagers.Systems;

public class CurrencySeeder
{
    private readonly IBaseCommandRepository<Currency> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public CurrencySeeder(
        IBaseCommandRepository<Currency> repository,
        IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task GenerateDataAsync()
    {
        var currencies = new List<(string Name, string Symbol)>
            {
                ("US Dollar", "$"),
                ("Euro", "€"),
                ("British Pound", "£"),
                ("Japanese Yen", "¥"),
                ("Indonesian Rupiah", "Rp")
            };

        foreach (var (name, symbol) in currencies)
        {
            var entity = await _repository
                .GetQuery()
                .ApplyIsDeletedFilter()
                .Where(x => x.Name == name)
                .SingleOrDefaultAsync();

            if (entity == null)
            {
                var newCurrency = new Currency(
                    null,
                    name,
                    symbol,
                    null);

                await _repository.CreateAsync(newCurrency);
                await _unitOfWork.SaveAsync();
            }
        }
    }
}