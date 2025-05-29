using BuildingBlocks.Domain.Interfaces;

namespace DigitalHSE.Domain.Interfaces;

public interface IDigitalHSEUnitOfWork : IUnitOfWork
{
    public ISampleModelRepository SampleModelRepository { get; init; }
    public IAnotherSampleModelRepository AnotherSampleModelRepository { get; init; }
}