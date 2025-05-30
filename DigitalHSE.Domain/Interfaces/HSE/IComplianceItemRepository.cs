using DigitalHSE.Domain.Common;
using DigitalHSE.Domain.HSE.Entities;

namespace DigitalHSE.Domain.Interfaces.HSE;

public interface IComplianceItemRepository : IRepository<ComplianceItem>
{
    Task<ComplianceItem?> GetByComplianceCodeAsync(string complianceCode, CancellationToken cancellationToken = default);
    Task<IEnumerable<ComplianceItem>> GetByCategoryAsync(string category, CancellationToken cancellationToken = default);
    Task<IEnumerable<ComplianceItem>> GetByStatusAsync(ComplianceStatus status, CancellationToken cancellationToken = default);
    Task<IEnumerable<ComplianceItem>> GetByDepartmentAsync(string department, CancellationToken cancellationToken = default);
    Task<IEnumerable<ComplianceItem>> GetOverdueItemsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<ComplianceItem>> GetUpcomingDueItemsAsync(int daysAhead = 30, CancellationToken cancellationToken = default);
    Task<IEnumerable<ComplianceItem>> GetInViolationAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<ComplianceItem>> GetIndonesianRegulationsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<ComplianceItem>> GetRequiringGovernmentReportingAsync(CancellationToken cancellationToken = default);
    Task<Dictionary<string, int>> GetComplianceStatisticsByCategoryAsync(CancellationToken cancellationToken = default);
    Task<double> GetOverallComplianceRateAsync(CancellationToken cancellationToken = default);
}