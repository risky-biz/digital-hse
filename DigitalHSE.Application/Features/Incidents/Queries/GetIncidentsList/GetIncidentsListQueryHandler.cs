using DigitalHSE.Application.Common;
using DigitalHSE.Application.ViewModels;
using DigitalHSE.Domain.Interfaces;

namespace DigitalHSE.Application.Features.Incidents.Queries.GetIncidentsList;

public class GetIncidentsListQueryHandler : ICommandQueryHandler<GetIncidentsListQuery, PagedList<IncidentListViewModel>>
{
    private readonly IDigitalHSEUnitOfWork _unitOfWork;

    public GetIncidentsListQueryHandler(IDigitalHSEUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<PagedList<IncidentListViewModel>>> Handle(GetIncidentsListQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // TODO: Implement actual filtering and querying logic
            // For now, return a simple mock response to get the build working
            
            var mockIncidents = new List<IncidentListViewModel>();
            var pagedResult = new PagedList<IncidentListViewModel>(
                mockIncidents,
                0, // total count
                request.PageNumber,
                request.PageSize
            );

            var result = new Result<PagedList<IncidentListViewModel>>();
            result.AddValue(pagedResult);
            result.OK();
            return result;
        }
        catch (Exception ex)
        {
            var result = new Result<PagedList<IncidentListViewModel>>();
            result.InternalServerError($"Failed to retrieve incidents list: {ex.Message}");
            return result;
        }
    }
}