using DigitalHSE.Domain.Common;
using DigitalHSE.Domain.HSE.Entities;

namespace DigitalHSE.Domain.Interfaces.HSE;

public interface ITrainingRecordRepository : IRepository<TrainingRecord>
{
    Task<TrainingRecord?> GetByRecordNumberAsync(string recordNumber, CancellationToken cancellationToken = default);
    Task<IEnumerable<TrainingRecord>> GetByEmployeeIdAsync(string employeeId, CancellationToken cancellationToken = default);
    Task<IEnumerable<TrainingRecord>> GetByDepartmentAsync(string department, CancellationToken cancellationToken = default);
    Task<IEnumerable<TrainingRecord>> GetByTrainingTypeAsync(string trainingType, CancellationToken cancellationToken = default);
    Task<IEnumerable<TrainingRecord>> GetExpiringTrainingsAsync(int daysAhead = 30, CancellationToken cancellationToken = default);
    Task<IEnumerable<TrainingRecord>> GetExpiredTrainingsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<TrainingRecord>> GetCompletedTrainingsAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
    Task<IEnumerable<TrainingRecord>> GetRegulatoryRequiredTrainingsAsync(CancellationToken cancellationToken = default);
    Task<double> GetTrainingComplianceRateAsync(string? department = null, CancellationToken cancellationToken = default);
    Task<Dictionary<string, int>> GetTrainingStatisticsByTypeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
}