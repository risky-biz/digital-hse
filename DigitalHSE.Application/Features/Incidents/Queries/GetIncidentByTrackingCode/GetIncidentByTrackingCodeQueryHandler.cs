using DigitalHSE.Application.Common;
using DigitalHSE.Domain.HSE.Entities;
using DigitalHSE.Domain.Interfaces;

namespace DigitalHSE.Application.Features.Incidents.Queries.GetIncidentByTrackingCode;

public class GetIncidentByTrackingCodeQueryHandler : ICommandQueryHandler<GetIncidentByTrackingCodeQuery, Incident>
{
    private readonly IDigitalHSEUnitOfWork _unitOfWork;

    public GetIncidentByTrackingCodeQueryHandler(IDigitalHSEUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Incident>> Handle(GetIncidentByTrackingCodeQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // Find incident by anonymous tracking code
            var incident = await _unitOfWork.IncidentRepository.GetByTrackingCodeAsync(request.TrackingCode);
            
            if (incident == null)
            {
                var notFoundResult = new Result<Incident>();
                notFoundResult.NotFound("Incident not found with provided tracking code");
                return notFoundResult;
            }

            // Verify this is an anonymous incident
            if (!incident.IsAnonymous)
            {
                var unauthorizedResult = new Result<Incident>();
                unauthorizedResult.Unauthorized("Tracking code access not available for non-anonymous incidents");
                return unauthorizedResult;
            }

            var result = new Result<Incident>();
            result.AddValue(incident);
            result.OK();
            return result;
        }
        catch (Exception ex)
        {
            var result = new Result<Incident>();
            result.InternalServerError($"Failed to retrieve incident by tracking code: {ex.Message}");
            return result;
        }
    }
}