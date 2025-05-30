using DigitalHSE.Domain.Interfaces;
using DigitalHSE.Domain.Interfaces.HSE;
using DigitalHSE.Infrastructure.Common;

namespace DigitalHSE.Infrastructure;

public class DigitalHSEUnitOfWork : UnitOfWork, IDigitalHSEUnitOfWork
{
    public DigitalHSEUnitOfWork(
        DigitalHSEDBContext dbContext,
        IIncidentRepository incidentRepository,
        IRiskAssessmentRepository riskAssessmentRepository,
        IPermitRepository permitRepository,
        IComplianceItemRepository complianceItemRepository,
        ITrainingRecordRepository trainingRecordRepository
        ) : base(dbContext)
    {
        IncidentRepository = incidentRepository;
        RiskAssessmentRepository = riskAssessmentRepository;
        PermitRepository = permitRepository;
        ComplianceItemRepository = complianceItemRepository;
        TrainingRecordRepository = trainingRecordRepository;
    }

    // HSE Repositories
    public IIncidentRepository IncidentRepository { get; }
    public IRiskAssessmentRepository RiskAssessmentRepository { get; }
    public IPermitRepository PermitRepository { get; }
    public IComplianceItemRepository ComplianceItemRepository { get; }
    public ITrainingRecordRepository TrainingRecordRepository { get; }
}