using DigitalHSE.Infrastructure.Common;
using DigitalHSE.Domain.HSE.Entities;
using DigitalHSE.Domain.HSE.Enums;
using DigitalHSE.Domain.Interfaces.HSE;
using Microsoft.EntityFrameworkCore;

namespace DigitalHSE.Infrastructure.Repositories.HSE;

public class PermitRepository : Repository<Permit>, IPermitRepository
{
    private readonly DigitalHSEDBContext _context;

    public PermitRepository(DigitalHSEDBContext dbContext) : base(dbContext)
    {
        _context = dbContext;
    }

    public async Task<Permit?> GetByPermitNumberAsync(string permitNumber, CancellationToken cancellationToken = default)
    {
        return await _context.Permits
            .FirstOrDefaultAsync(p => p.PermitNumber == permitNumber, cancellationToken);
    }

    public async Task<IEnumerable<Permit>> GetActivePermitsAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Permits
            .Where(p => p.Status == PermitStatus.Active)
            .OrderBy(p => p.RequestedEndDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Permit>> GetByStatusAsync(PermitStatus status, CancellationToken cancellationToken = default)
    {
        return await _context.Permits
            .Where(p => p.Status == status)
            .OrderByDescending(p => p.RequestedStartDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Permit>> GetByTypeAsync(PermitType type, CancellationToken cancellationToken = default)
    {
        return await _context.Permits
            .Where(p => p.Type == type)
            .OrderByDescending(p => p.RequestedStartDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Permit>> GetByDepartmentAsync(string department, CancellationToken cancellationToken = default)
    {
        return await _context.Permits
            .Where(p => p.Department == department)
            .OrderByDescending(p => p.RequestedStartDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Permit>> GetExpiringPermitsAsync(int daysAhead = 7, CancellationToken cancellationToken = default)
    {
        var futureDate = DateTime.UtcNow.AddDays(daysAhead);
        return await _context.Permits
            .Where(p => p.Status == PermitStatus.Active && 
                       p.RequestedEndDate <= futureDate && 
                       p.RequestedEndDate > DateTime.UtcNow)
            .OrderBy(p => p.RequestedEndDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Permit>> GetExpiredPermitsAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        return await _context.Permits
            .Where(p => p.Status == PermitStatus.Active && p.RequestedEndDate < now)
            .OrderBy(p => p.RequestedEndDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Permit>> GetPermitsForDateRangeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        return await _context.Permits
            .Where(p => (p.RequestedStartDate >= startDate && p.RequestedStartDate <= endDate) ||
                       (p.RequestedEndDate >= startDate && p.RequestedEndDate <= endDate) ||
                       (p.RequestedStartDate <= startDate && p.RequestedEndDate >= endDate))
            .OrderBy(p => p.RequestedStartDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Permit>> GetHighRiskPermitsAsync(CancellationToken cancellationToken = default)
    {
        var highRiskTypes = new[] { PermitType.HotWork, PermitType.ConfinedSpace, PermitType.WorkingAtHeight };
        return await _context.Permits
            .Where(p => highRiskTypes.Contains(p.Type) && 
                       (p.Status == PermitStatus.Active || p.Status == PermitStatus.Approved))
            .OrderBy(p => p.RequestedStartDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<Dictionary<PermitType, int>> GetPermitStatisticsByTypeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        return await _context.Permits
            .Where(p => p.RequestedStartDate >= startDate && p.RequestedStartDate <= endDate)
            .GroupBy(p => p.Type)
            .Select(g => new { Type = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Type, x => x.Count, cancellationToken);
    }
}