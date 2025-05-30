using DigitalHSE.Infrastructure.Common;
using DigitalHSE.Domain.HSE.Entities;
using DigitalHSE.Domain.Interfaces.HSE;
using Microsoft.EntityFrameworkCore;

namespace DigitalHSE.Infrastructure.Repositories.HSE;

public class ComplianceItemRepository : Repository<ComplianceItem>, IComplianceItemRepository
{
    private readonly DigitalHSEDBContext _context;

    public ComplianceItemRepository(DigitalHSEDBContext dbContext) : base(dbContext)
    {
        _context = dbContext;
    }

    public async Task<ComplianceItem?> GetByComplianceCodeAsync(string complianceCode, CancellationToken cancellationToken = default)
    {
        return await _context.ComplianceItems
            .FirstOrDefaultAsync(c => c.ComplianceCode == complianceCode, cancellationToken);
    }

    public async Task<IEnumerable<ComplianceItem>> GetByCategoryAsync(string category, CancellationToken cancellationToken = default)
    {
        return await _context.ComplianceItems
            .Where(c => c.Category == category)
            .OrderBy(c => c.NextDueDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ComplianceItem>> GetByStatusAsync(ComplianceStatus status, CancellationToken cancellationToken = default)
    {
        return await _context.ComplianceItems
            .Where(c => c.Status == status)
            .OrderBy(c => c.NextDueDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ComplianceItem>> GetByDepartmentAsync(string department, CancellationToken cancellationToken = default)
    {
        return await _context.ComplianceItems
            .Where(c => c.ResponsibleDepartment == department)
            .OrderBy(c => c.NextDueDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ComplianceItem>> GetOverdueItemsAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        return await _context.ComplianceItems
            .Where(c => c.NextDueDate < now && c.Status != ComplianceStatus.Compliant)
            .OrderBy(c => c.NextDueDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ComplianceItem>> GetUpcomingDueItemsAsync(int daysAhead = 30, CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var futureDate = now.AddDays(daysAhead);
        return await _context.ComplianceItems
            .Where(c => c.NextDueDate >= now && c.NextDueDate <= futureDate)
            .OrderBy(c => c.NextDueDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ComplianceItem>> GetInViolationAsync(CancellationToken cancellationToken = default)
    {
        return await _context.ComplianceItems
            .Where(c => c.IsInViolation)
            .OrderBy(c => c.ViolationDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ComplianceItem>> GetIndonesianRegulationsAsync(CancellationToken cancellationToken = default)
    {
        return await _context.ComplianceItems
            .Where(c => c.IsIndonesianRegulation)
            .OrderBy(c => c.NextDueDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ComplianceItem>> GetRequiringGovernmentReportingAsync(CancellationToken cancellationToken = default)
    {
        return await _context.ComplianceItems
            .Where(c => c.RequiresGovernmentReporting)
            .OrderBy(c => c.NextDueDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<Dictionary<string, int>> GetComplianceStatisticsByCategoryAsync(CancellationToken cancellationToken = default)
    {
        return await _context.ComplianceItems
            .GroupBy(c => c.Category)
            .Select(g => new { Category = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Category, x => x.Count, cancellationToken);
    }

    public async Task<double> GetOverallComplianceRateAsync(CancellationToken cancellationToken = default)
    {
        var total = await _context.ComplianceItems
            .Where(c => c.Status != ComplianceStatus.Expired)
            .CountAsync(cancellationToken);
            
        if (total == 0) return 100.0;
        
        var compliant = await _context.ComplianceItems
            .Where(c => c.Status == ComplianceStatus.Compliant)
            .CountAsync(cancellationToken);
            
        return (double)compliant / total * 100;
    }
}