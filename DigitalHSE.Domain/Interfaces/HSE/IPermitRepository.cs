using DigitalHSE.Domain.Common;
using DigitalHSE.Domain.HSE.Entities;
using DigitalHSE.Domain.HSE.Enums;

namespace DigitalHSE.Domain.Interfaces.HSE;

public interface IPermitRepository : IRepository<Permit>
{
    Task<Permit?> GetByPermitNumberAsync(string permitNumber, CancellationToken cancellationToken = default);
    Task<IEnumerable<Permit>> GetActivePermitsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Permit>> GetByStatusAsync(PermitStatus status, CancellationToken cancellationToken = default);
    Task<IEnumerable<Permit>> GetByTypeAsync(PermitType type, CancellationToken cancellationToken = default);
    Task<IEnumerable<Permit>> GetByDepartmentAsync(string department, CancellationToken cancellationToken = default);
    Task<IEnumerable<Permit>> GetExpiringPermitsAsync(int daysAhead = 7, CancellationToken cancellationToken = default);
    Task<IEnumerable<Permit>> GetExpiredPermitsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Permit>> GetPermitsForDateRangeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
    Task<IEnumerable<Permit>> GetHighRiskPermitsAsync(CancellationToken cancellationToken = default);
    Task<Dictionary<PermitType, int>> GetPermitStatisticsByTypeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
}