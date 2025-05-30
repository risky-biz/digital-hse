using DigitalHSE.Domain.Common;
using DigitalHSE.Domain.Interfaces.HSE;

namespace DigitalHSE.Domain.Interfaces;

public interface IDigitalHSEUnitOfWork : IUnitOfWork
{
    // HSE Repositories
    IIncidentRepository IncidentRepository { get; }
    IRiskAssessmentRepository RiskAssessmentRepository { get; }
    IPermitRepository PermitRepository { get; }
    IComplianceItemRepository ComplianceItemRepository { get; }
    ITrainingRecordRepository TrainingRecordRepository { get; }
}