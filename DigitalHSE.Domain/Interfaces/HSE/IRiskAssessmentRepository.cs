using DigitalHSE.Domain.Common;
using DigitalHSE.Domain.HSE.Entities;
using DigitalHSE.Domain.HSE.Enums;

namespace DigitalHSE.Domain.Interfaces.HSE;

public interface IRiskAssessmentRepository : IRepository<RiskAssessment>
{
    Task<RiskAssessment?> GetByAssessmentNumberAsync(string assessmentNumber, CancellationToken cancellationToken = default);
    Task<IEnumerable<RiskAssessment>> GetActiveAssessmentsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<RiskAssessment>> GetByRiskLevelAsync(RiskLevel riskLevel, bool useResidualRisk = false, CancellationToken cancellationToken = default);
    Task<IEnumerable<RiskAssessment>> GetByDepartmentAsync(string department, CancellationToken cancellationToken = default);
    Task<IEnumerable<RiskAssessment>> GetOverdueForReviewAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<RiskAssessment>> GetRequiringGovernmentNotificationAsync(CancellationToken cancellationToken = default);
    Task<Dictionary<RiskLevel, int>> GetRiskDistributionAsync(bool useResidualRisk = false, CancellationToken cancellationToken = default);
    Task<IEnumerable<RiskAssessment>> GetHighRiskAssessmentsAsync(CancellationToken cancellationToken = default);
}