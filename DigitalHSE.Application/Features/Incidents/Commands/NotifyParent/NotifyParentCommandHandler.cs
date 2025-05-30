using DigitalHSE.Application.Common;
using DigitalHSE.Domain.Interfaces;

namespace DigitalHSE.Application.Features.Incidents.Commands.NotifyParent;

public class NotifyParentCommandHandler : ICommandQueryHandler<NotifyParentCommand, bool>
{
    private readonly IDigitalHSEUnitOfWork _unitOfWork;

    public NotifyParentCommandHandler(IDigitalHSEUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<bool>> Handle(NotifyParentCommand request, CancellationToken cancellationToken)
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

            // Check if this is a student incident
            if (!incident.IsStudentIncident())
            {
                var invalidResult = new Result<bool>();
                invalidResult.BadRequest("Parent notification is only applicable for student incidents");
                return invalidResult;
            }

            // Record the parent notification
            incident.NotifyParent(request.NotificationMethod);

            await _unitOfWork.SaveChangesAsync();

            // TODO: Integrate with notification service (SMS, Email, WhatsApp)
            // TODO: Send actual notification based on method
            // TODO: Create notification log entry
            // TODO: Schedule follow-up if no acknowledgment

            var result = new Result<bool>();
            result.AddValue(true);
            result.OK();
            return result;
        }
        catch (Exception ex)
        {
            var result = new Result<bool>();
            result.InternalServerError($"Failed to notify parent: {ex.Message}");
            return result;
        }
    }
}