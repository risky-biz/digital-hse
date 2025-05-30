using DigitalHSE.Domain.Common;
using Microsoft.EntityFrameworkCore;

namespace DigitalHSE.Infrastructure.Common;

public class UnitOfWork : IUnitOfWork
{
    protected readonly DbContext _context;

    public UnitOfWork(DbContext context)
    {
        _context = context;
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}