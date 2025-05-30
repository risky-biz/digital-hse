using DigitalHSE.Application.Common;

namespace DigitalHSE.Application.Features.Incidents.Commands.CompleteInvestigation;

public record CompleteInvestigationCommand : ICommandQuery<bool>
{
    public int IncidentId { get; init; }
    public string RootCauseAnalysis { get; init; } = string.Empty;
    public string ContributingFactors { get; init; } = string.Empty;
    public string LessonsLearned { get; init; } = string.Empty;
    public string InvestigationSummary { get; init; } = string.Empty;
    public List<string> RecommendedActions { get; init; } = new();
    public List<string> AdditionalEvidenceUrls { get; init; } = new();
    public bool RequiresCAPAActions { get; init; }
    public string CompletedBy { get; init; } = string.Empty;
}