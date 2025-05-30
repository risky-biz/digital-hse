using DigitalHSE.Infrastructure.Common;
using DigitalHSE.Domain.HSE.Entities;
using DigitalHSE.Domain.Interfaces.HSE;
using Microsoft.EntityFrameworkCore;

namespace DigitalHSE.Infrastructure.Repositories.HSE;

public class TrainingRecordRepository : Repository<TrainingRecord>, ITrainingRecordRepository
{
    private readonly DigitalHSEDBContext _context;

    public TrainingRecordRepository(DigitalHSEDBContext dbContext) : base(dbContext)
    {
        _context = dbContext;
    }

    public async Task<TrainingRecord?> GetByRecordNumberAsync(string recordNumber, CancellationToken cancellationToken = default)
    {
        return await _context.TrainingRecords
            .FirstOrDefaultAsync(t => t.RecordNumber == recordNumber, cancellationToken);
    }

    public async Task<IEnumerable<TrainingRecord>> GetByEmployeeIdAsync(string employeeId, CancellationToken cancellationToken = default)
    {
        return await _context.TrainingRecords
            .Where(t => t.EmployeeId == employeeId)
            .OrderByDescending(t => t.TrainingDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<TrainingRecord>> GetByDepartmentAsync(string department, CancellationToken cancellationToken = default)
    {
        return await _context.TrainingRecords
            .Where(t => t.Department == department)
            .OrderByDescending(t => t.TrainingDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<TrainingRecord>> GetByTrainingTypeAsync(string trainingType, CancellationToken cancellationToken = default)
    {
        return await _context.TrainingRecords
            .Where(t => t.TrainingType == trainingType)
            .OrderByDescending(t => t.TrainingDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<TrainingRecord>> GetExpiringTrainingsAsync(int daysAhead = 30, CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var futureDate = now.AddDays(daysAhead);
        return await _context.TrainingRecords
            .Where(t => t.ExpiryDate.HasValue && 
                       t.ExpiryDate.Value >= now && 
                       t.ExpiryDate.Value <= futureDate)
            .OrderBy(t => t.ExpiryDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<TrainingRecord>> GetExpiredTrainingsAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        return await _context.TrainingRecords
            .Where(t => t.ExpiryDate.HasValue && t.ExpiryDate.Value < now)
            .OrderBy(t => t.ExpiryDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<TrainingRecord>> GetCompletedTrainingsAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        return await _context.TrainingRecords
            .Where(t => t.IsCompleted && 
                       t.CompletionDate.HasValue &&
                       t.CompletionDate.Value >= startDate && 
                       t.CompletionDate.Value <= endDate)
            .OrderByDescending(t => t.CompletionDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<TrainingRecord>> GetRegulatoryRequiredTrainingsAsync(CancellationToken cancellationToken = default)
    {
        return await _context.TrainingRecords
            .Where(t => t.IsRegulatoryRequired)
            .OrderByDescending(t => t.TrainingDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<double> GetTrainingComplianceRateAsync(string? department = null, CancellationToken cancellationToken = default)
    {
        var query = _context.TrainingRecords
            .Where(t => t.RequiresRefresher);
            
        if (!string.IsNullOrEmpty(department))
            query = query.Where(t => t.Department == department);
            
        var total = await query.CountAsync(cancellationToken);
        
        if (total == 0) return 100.0;
        
        var now = DateTime.UtcNow;
        var compliant = await query
            .Where(t => !t.ExpiryDate.HasValue || t.ExpiryDate.Value >= now)
            .CountAsync(cancellationToken);
            
        return (double)compliant / total * 100;
    }

    public async Task<Dictionary<string, int>> GetTrainingStatisticsByTypeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        return await _context.TrainingRecords
            .Where(t => t.TrainingDate >= startDate && t.TrainingDate <= endDate)
            .GroupBy(t => t.TrainingType)
            .Select(g => new { Type = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Type, x => x.Count, cancellationToken);
    }
}