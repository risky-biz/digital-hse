using BuildingBlocks.Domain.Interfaces;
using DigitalHSE.Domain.Models;

namespace DigitalHSE.Domain.Interfaces;

public interface IAnotherSampleModelRepository : IReadOnlyRepository<AnotherSampleModel>
{
    public Task<int> GetTotalCount(CancellationToken cancellationToken = default);
}
