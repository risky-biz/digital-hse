using DigitalHSE.Application.Common;
using DigitalHSE.Domain.HSE.Entities;

namespace DigitalHSE.Application.Features.Incidents.Queries.GetIncidentByTrackingCode;

public record GetIncidentByTrackingCodeQuery : ICommandQuery<Incident>
{
    public string TrackingCode { get; init; } = string.Empty;
}