using DigitalHSE.Domain.Common;
using DigitalHSE.Domain.HSE.Entities;
using DigitalHSE.Domain.HSE.Enums;

namespace DigitalHSE.Domain.Interfaces.HSE;

public interface IIncidentRepository : IRepository<Incident>
{
    Task<Incident?> GetByIncidentNumberAsync(string incidentNumber, CancellationToken cancellationToken = default);
    Task<Incident?> GetByTrackingCodeAsync(string trackingCode, CancellationToken cancellationToken = default);
    Task<IEnumerable<Incident>> GetByStatusAsync(IncidentStatus status, CancellationToken cancellationToken = default);
    Task<IEnumerable<Incident>> GetBySeverityAsync(IncidentSeverity severity, CancellationToken cancellationToken = default);
    Task<IEnumerable<Incident>> GetByDepartmentAsync(string department, CancellationToken cancellationToken = default);
    Task<IEnumerable<Incident>> GetByDateRangeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
    Task<IEnumerable<Incident>> GetRequiringBPJSReportingAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Incident>> GetRequiringMinistryReportingAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Incident>> GetOverdueRegulatoryReportingAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Incident>> GetByInvestigationStatusAsync(InvestigationStatus status, CancellationToken cancellationToken = default);
    Task<IEnumerable<Incident>> GetOverdueInvestigationsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Incident>> GetStudentIncidentsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Incident>> GetRequiringParentNotificationAsync(CancellationToken cancellationToken = default);
    Task<int> GetIncidentCountByDepartmentAsync(string department, DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default);
    Task<Dictionary<string, int>> GetIncidentStatisticsByDepartmentAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
    Task<Dictionary<IncidentSeverity, int>> GetIncidentStatisticsBySeverityAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
    Task<Dictionary<IncidentCategory, int>> GetIncidentStatisticsByCategoryAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
    Task<Dictionary<PersonType, int>> GetIncidentStatisticsByPersonTypeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
}