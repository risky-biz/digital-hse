using DigitalHSE.Application.Common;

namespace DigitalHSE.Application.Features.Incidents.Commands.StartInvestigation;

public record StartInvestigationCommand : ICommandQuery<bool>
{
    public int IncidentId { get; init; }
    public string InvestigatedBy { get; init; } = string.Empty;
    public string InvestigatorEmail { get; init; } = string.Empty;
    public string InvestigatorRole { get; init; } = string.Empty;
    public DateTime? TargetCompletionDate { get; init; }
    public string InitialNotes { get; init; } = string.Empty;
}