using BuildingBlocks.Infrastructure.Implementations;
using DigitalHSE.Domain.Interfaces;
using DigitalHSE.Domain.Models;
using DigitalHSE.Infrastructure.QueryTexts;

namespace DigitalHSE.Infrastructure.Repositories;

public class AnotherSampleModelRepository(
    DBContext dbContext
    ) : ReadOnlyRepository<AnotherSampleModel>(dbContext), IAnotherSampleModelRepository
{
    public async Task<int> GetTotalCount(CancellationToken cancellationToken = default)
    {
        var result = await _dbContext.QueryGetAsync<int>(Queries.GetAnotherSampleModelTotalCount, cancellationToken);
        return result;
    }
}