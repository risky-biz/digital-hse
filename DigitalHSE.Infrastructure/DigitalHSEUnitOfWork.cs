using BuildingBlocks.Infrastructure.Implementations;
using DigitalHSE.Domain.Interfaces;

namespace DigitalHSE.Infrastructure;

public class DigitalHSEUnitOfWork(
    DBContext dbContext,
    ISampleModelRepository sampleModelRepository,
    IAnotherSampleModelRepository anotherSampleModelRepository
    ) : UnitOfWork(dbContext), IDigitalHSEUnitOfWork
{
    public ISampleModelRepository SampleModelRepository { get; init; } = sampleModelRepository;
    public IAnotherSampleModelRepository AnotherSampleModelRepository { get; init; } = anotherSampleModelRepository;
}
