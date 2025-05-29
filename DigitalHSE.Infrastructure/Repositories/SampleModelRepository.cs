using BuildingBlocks.Domain.Interfaces;
using BuildingBlocks.Infrastructure.Implementations;
using Microsoft.EntityFrameworkCore;
using DigitalHSE.Domain.Interfaces;
using DigitalHSE.Domain.Models;

namespace DigitalHSE.Infrastructure.Repositories;

public class SampleModelRepository(
    DBContext dbContext,
    ICurrentUser currentUser
    ) : Repository<SampleModel>(dbContext, currentUser), ISampleModelRepository
{
    public async Task<int> GetTotalCount(CancellationToken cancellationToken = default)
    {
        await Task.Delay(2000, cancellationToken); // To check Redis speed

        var result = await SetAsNoTracking.CountAsync(cancellationToken);
        //var result = await _dbContext.QueryGetAsync<int>(Queries.GetSampleModelTotalCount, cancellationToken);
        return result;
    }
}