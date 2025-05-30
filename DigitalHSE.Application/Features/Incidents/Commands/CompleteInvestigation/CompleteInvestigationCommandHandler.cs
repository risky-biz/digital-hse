using DigitalHSE.Application.Common;
using DigitalHSE.Domain.Interfaces;

namespace DigitalHSE.Application.Features.Incidents.Commands.CompleteInvestigation;

public class CompleteInvestigationCommandHandler : ICommandQueryHandler<CompleteInvestigationCommand, bool>
{
    private readonly IDigitalHSEUnitOfWork _unitOfWork;

    public CompleteInvestigationCommandHandler(IDigitalHSEUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<bool>> Handle(CompleteInvestigationCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var incident = await _unitOfWork.IncidentRepository.GetByIdAsync(request.IncidentId);
            if (incident == null)
            {
                var notFoundResult = new Result<bool>();
                notFoundResult.NotFound("Incident not found");
                return notFoundResult;
            }

            // Complete the investigation
            incident.CompleteInvestigation(
                request.RootCauseAnalysis,
                request.ContributingFactors,
                request.LessonsLearned
            );

            // Add additional evidence if provided
            if (request.AdditionalEvidenceUrls.Any())
            {
                incident.AddDocuments(request.AdditionalEvidenceUrls);
            }

            await _unitOfWork.SaveChangesAsync();

            // TODO: If CAPA actions are required, create CAPA records
            // TODO: Send investigation completion notifications
            // TODO: Update dashboards and reporting

            var result = new Result<bool>();
            result.AddValue(true);
            result.OK();
            return result;
        }
        catch (Exception ex)
        {
            var result = new Result<bool>();
            result.InternalServerError($"Failed to complete investigation: {ex.Message}");
            return result;
        }
    }
}