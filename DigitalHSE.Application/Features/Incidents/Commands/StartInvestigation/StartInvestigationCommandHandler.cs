using DigitalHSE.Application.Common;
using DigitalHSE.Domain.Interfaces;

namespace DigitalHSE.Application.Features.Incidents.Commands.StartInvestigation;

public class StartInvestigationCommandHandler : ICommandQueryHandler<StartInvestigationCommand, bool>
{
    private readonly IDigitalHSEUnitOfWork _unitOfWork;

    public StartInvestigationCommandHandler(IDigitalHSEUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<bool>> Handle(StartInvestigationCommand request, CancellationToken cancellationToken)
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

            // Start the investigation
            incident.StartInvestigation(request.InvestigatedBy);

            await _unitOfWork.SaveChangesAsync();

            // TODO: Send notification to investigator
            // TODO: Add to investigation dashboard
            // TODO: Set automatic reminders

            var result = new Result<bool>();
            result.AddValue(true);
            result.OK();
            return result;
        }
        catch (Exception ex)
        {
            var result = new Result<bool>();
            result.InternalServerError($"Failed to start investigation: {ex.Message}");
            return result;
        }
    }
}