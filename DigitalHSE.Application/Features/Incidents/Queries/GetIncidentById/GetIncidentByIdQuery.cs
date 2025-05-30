using DigitalHSE.Application.Common;
using DigitalHSE.Domain.HSE.Entities;

namespace DigitalHSE.Application.Features.Incidents.Queries.GetIncidentById;

public record GetIncidentByIdQuery : ICommandQuery<Incident>
{
    public int IncidentId { get; init; }
    public bool IncludeInvestigations { get; init; } = true;
    public bool IncludeCAPAs { get; init; } = true;
    public bool IncludeNotifications { get; init; } = true;
}