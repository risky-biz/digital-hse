namespace DigitalHSE.Domain.Common;

public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    void Dispose();
}