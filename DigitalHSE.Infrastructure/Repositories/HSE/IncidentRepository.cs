using DigitalHSE.Domain.HSE.Entities;
using DigitalHSE.Domain.HSE.Enums;
using DigitalHSE.Domain.Interfaces.HSE;
using DigitalHSE.Infrastructure.Common;
using Microsoft.EntityFrameworkCore;

namespace DigitalHSE.Infrastructure.Repositories.HSE;

public class IncidentRepository : Repository<Incident>, IIncidentRepository
{
    private readonly DigitalHSEDBContext _context;

    public IncidentRepository(DigitalHSEDBContext dbContext) : base(dbContext)
    {
        _context = dbContext;
    }

    public async Task<Incident?> GetByIncidentNumberAsync(string incidentNumber, CancellationToken cancellationToken = default)
    {
        return await _context.Incidents
            .FirstOrDefaultAsync(i => i.IncidentNumber == incidentNumber, cancellationToken);
    }

    public async Task<IEnumerable<Incident>> GetByStatusAsync(IncidentStatus status, CancellationToken cancellationToken = default)
    {
        return await _context.Incidents
            .Where(i => i.Status == status)
            .OrderByDescending(i => i.IncidentDateTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Incident>> GetBySeverityAsync(IncidentSeverity severity, CancellationToken cancellationToken = default)
    {
        return await _context.Incidents
            .Where(i => i.Severity == severity)
            .OrderByDescending(i => i.IncidentDateTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Incident>> GetByDepartmentAsync(string department, CancellationToken cancellationToken = default)
    {
        return await _context.Incidents
            .Where(i => i.Department == department)
            .OrderByDescending(i => i.IncidentDateTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Incident>> GetByDateRangeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        return await _context.Incidents
            .Where(i => i.IncidentDateTime >= startDate && i.IncidentDateTime <= endDate)
            .OrderByDescending(i => i.IncidentDateTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Incident>> GetRequiringBPJSReportingAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Incidents
            .Where(i => i.RequiresBPJSReporting && !i.BPJSReportedDate.HasValue)
            .OrderBy(i => i.RegulatoryDeadline)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Incident>> GetRequiringMinistryReportingAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Incidents
            .Where(i => i.RequiresMinistryReporting && !i.MinistryReportedDate.HasValue)
            .OrderBy(i => i.RegulatoryDeadline)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Incident>> GetOverdueRegulatoryReportingAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        return await _context.Incidents
            .Where(i => i.RegulatoryDeadline.HasValue && 
                       i.RegulatoryDeadline.Value < now &&
                       ((i.RequiresBPJSReporting && !i.BPJSReportedDate.HasValue) ||
                        (i.RequiresMinistryReporting && !i.MinistryReportedDate.HasValue)))
            .OrderBy(i => i.RegulatoryDeadline)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> GetIncidentCountByDepartmentAsync(string department, DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default)
    {
        var query = _context.Incidents.Where(i => i.Department == department);
        
        if (startDate.HasValue)
            query = query.Where(i => i.IncidentDateTime >= startDate.Value);
            
        if (endDate.HasValue)
            query = query.Where(i => i.IncidentDateTime <= endDate.Value);
            
        return await query.CountAsync(cancellationToken);
    }

    public async Task<Dictionary<string, int>> GetIncidentStatisticsByDepartmentAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        return await _context.Incidents
            .Where(i => i.IncidentDateTime >= startDate && i.IncidentDateTime <= endDate)
            .GroupBy(i => i.Department)
            .Select(g => new { Department = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Department, x => x.Count, cancellationToken);
    }

    public async Task<Dictionary<IncidentSeverity, int>> GetIncidentStatisticsBySeverityAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        return await _context.Incidents
            .Where(i => i.IncidentDateTime >= startDate && i.IncidentDateTime <= endDate)
            .GroupBy(i => i.Severity)
            .Select(g => new { Severity = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Severity, x => x.Count, cancellationToken);
    }

    public async Task<Incident?> GetByTrackingCodeAsync(string trackingCode, CancellationToken cancellationToken = default)
    {
        return await _context.Incidents
            .FirstOrDefaultAsync(i => i.AnonymousTrackingCode == trackingCode, cancellationToken);
    }

    public async Task<IEnumerable<Incident>> GetByInvestigationStatusAsync(InvestigationStatus status, CancellationToken cancellationToken = default)
    {
        return await _context.Incidents
            .Where(i => i.InvestigationStatus == status)
            .OrderByDescending(i => i.IncidentDateTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Incident>> GetOverdueInvestigationsAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        return await _context.Incidents
            .Where(i => i.InvestigationDueDate.HasValue && 
                       i.InvestigationDueDate.Value < now &&
                       i.InvestigationStatus != InvestigationStatus.Completed)
            .OrderBy(i => i.InvestigationDueDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Incident>> GetStudentIncidentsAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Incidents
            .Where(i => i.PersonAffectedType == PersonType.Student || 
                       !string.IsNullOrEmpty(i.PersonAffectedClass))
            .OrderByDescending(i => i.IncidentDateTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Incident>> GetRequiringParentNotificationAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Incidents
            .Where(i => (i.PersonAffectedType == PersonType.Student || 
                        !string.IsNullOrEmpty(i.PersonAffectedClass)) &&
                       !i.ParentNotified &&
                       (i.Severity >= IncidentSeverity.Moderate ||
                        i.Urgency >= IncidentUrgency.High ||
                        i.RequiresMedicalAttention))
            .OrderBy(i => i.IncidentDateTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<Dictionary<IncidentCategory, int>> GetIncidentStatisticsByCategoryAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        return await _context.Incidents
            .Where(i => i.IncidentDateTime >= startDate && i.IncidentDateTime <= endDate)
            .GroupBy(i => i.Category)
            .Select(g => new { Category = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Category, x => x.Count, cancellationToken);
    }

    public async Task<Dictionary<PersonType, int>> GetIncidentStatisticsByPersonTypeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        return await _context.Incidents
            .Where(i => i.IncidentDateTime >= startDate && i.IncidentDateTime <= endDate)
            .GroupBy(i => i.PersonAffectedType)
            .Select(g => new { PersonType = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.PersonType, x => x.Count, cancellationToken);
    }
}