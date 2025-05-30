using DigitalHSE.Infrastructure.Common;
using DigitalHSE.Domain.HSE.Entities;
using DigitalHSE.Domain.HSE.Enums;
using DigitalHSE.Domain.Interfaces.HSE;
using Microsoft.EntityFrameworkCore;

namespace DigitalHSE.Infrastructure.Repositories.HSE;

public class RiskAssessmentRepository : Repository<RiskAssessment>, IRiskAssessmentRepository
{
    private readonly DigitalHSEDBContext _context;

    public RiskAssessmentRepository(DigitalHSEDBContext dbContext) : base(dbContext)
    {
        _context = dbContext;
    }

    public async Task<RiskAssessment?> GetByAssessmentNumberAsync(string assessmentNumber, CancellationToken cancellationToken = default)
    {
        return await _context.RiskAssessments
            .FirstOrDefaultAsync(r => r.AssessmentNumber == assessmentNumber, cancellationToken);
    }

    public async Task<IEnumerable<RiskAssessment>> GetActiveAssessmentsAsync(CancellationToken cancellationToken = default)
    {
        return await _context.RiskAssessments
            .Where(r => r.IsActive && r.IsApproved)
            .OrderByDescending(r => r.AssessmentDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<RiskAssessment>> GetByRiskLevelAsync(RiskLevel riskLevel, bool useResidualRisk = false, CancellationToken cancellationToken = default)
    {
        if (useResidualRisk)
        {
            return await _context.RiskAssessments
                .Where(r => r.ResidualRiskLevel == riskLevel && r.IsActive)
                .OrderByDescending(r => r.AssessmentDate)
                .ToListAsync(cancellationToken);
        }
        else
        {
            return await _context.RiskAssessments
                .Where(r => r.InitialRiskLevel == riskLevel && r.IsActive)
                .OrderByDescending(r => r.AssessmentDate)
                .ToListAsync(cancellationToken);
        }
    }

    public async Task<IEnumerable<RiskAssessment>> GetByDepartmentAsync(string department, CancellationToken cancellationToken = default)
    {
        return await _context.RiskAssessments
            .Where(r => r.Department == department && r.IsActive)
            .OrderByDescending(r => r.AssessmentDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<RiskAssessment>> GetOverdueForReviewAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        return await _context.RiskAssessments
            .Where(r => r.IsActive && r.NextReviewDate.HasValue && r.NextReviewDate.Value < now)
            .OrderBy(r => r.NextReviewDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<RiskAssessment>> GetRequiringGovernmentNotificationAsync(CancellationToken cancellationToken = default)
    {
        return await _context.RiskAssessments
            .Where(r => r.RequiresGovernmentNotification && !r.GovernmentNotificationDate.HasValue && r.IsActive)
            .OrderByDescending(r => r.InitialRiskLevel)
            .ToListAsync(cancellationToken);
    }

    public async Task<Dictionary<RiskLevel, int>> GetRiskDistributionAsync(bool useResidualRisk = false, CancellationToken cancellationToken = default)
    {
        if (useResidualRisk)
        {
            return await _context.RiskAssessments
                .Where(r => r.IsActive && r.ResidualRiskScore > 0)
                .GroupBy(r => r.ResidualRiskLevel)
                .Select(g => new { RiskLevel = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.RiskLevel, x => x.Count, cancellationToken);
        }
        else
        {
            return await _context.RiskAssessments
                .Where(r => r.IsActive)
                .GroupBy(r => r.InitialRiskLevel)
                .Select(g => new { RiskLevel = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.RiskLevel, x => x.Count, cancellationToken);
        }
    }

    public async Task<IEnumerable<RiskAssessment>> GetHighRiskAssessmentsAsync(CancellationToken cancellationToken = default)
    {
        return await _context.RiskAssessments
            .Where(r => r.IsActive && 
                       (r.InitialRiskLevel == RiskLevel.High || r.InitialRiskLevel == RiskLevel.Extreme))
            .OrderByDescending(r => r.InitialRiskScore)
            .ToListAsync(cancellationToken);
    }
}