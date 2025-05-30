using DigitalHSE.Application.Common;
using DigitalHSE.Domain.HSE.Entities;
using DigitalHSE.Domain.Interfaces;

namespace DigitalHSE.Application.Features.Incidents.Queries.GetIncidentById;

public class GetIncidentByIdQueryHandler : ICommandQueryHandler<GetIncidentByIdQuery, Incident>
{
    private readonly IDigitalHSEUnitOfWork _unitOfWork;

    public GetIncidentByIdQueryHandler(IDigitalHSEUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Incident>> Handle(GetIncidentByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var incident = await _unitOfWork.IncidentRepository.GetByIdAsync(request.IncidentId);
            
            if (incident == null)
            {
                var notFoundResult = new Result<Incident>();
                notFoundResult.NotFound("Incident not found");
                return notFoundResult;
            }

            // TODO: Load related entities based on request parameters
            // if (request.IncludeInvestigations) { ... }
            // if (request.IncludeCAPAs) { ... }
            // if (request.IncludeNotifications) { ... }

            var result = new Result<Incident>();
            result.AddValue(incident);
            result.OK();
            return result;
        }
        catch (Exception ex)
        {
            var result = new Result<Incident>();
            result.InternalServerError($"Failed to retrieve incident: {ex.Message}");
            return result;
        }
    }
}