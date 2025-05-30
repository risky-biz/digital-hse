using DigitalHSE.Application.Common;
using DigitalHSE.Application.ViewModels;
using DigitalHSE.Domain.HSE.Enums;

namespace DigitalHSE.Application.Features.Incidents.Queries.GetIncidentsList;

public record GetIncidentsListQuery : ICommandQuery<PagedList<IncidentListViewModel>>
{
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 20;
    public string? SearchTerm { get; init; }
    public IncidentCategory? Category { get; init; }
    public IncidentType? Type { get; init; }
    public IncidentSeverity? Severity { get; init; }
    public IncidentUrgency? Urgency { get; init; }
    public IncidentStatus? Status { get; init; }
    public InvestigationStatus? InvestigationStatus { get; init; }
    public DateTime? DateFrom { get; init; }
    public DateTime? DateTo { get; init; }
    public string? Department { get; init; }
    public string? Building { get; init; }
    public string? Location { get; init; }
    public PersonType? PersonAffectedType { get; init; }
    public PersonType? ReporterType { get; init; }
    public bool? IsStudentIncident { get; init; }
    public bool? IsAnonymous { get; init; }
    public bool? RequiresBPJSReporting { get; init; }
    public bool? RequiresMinistryReporting { get; init; }
    public bool? IsOverdue { get; init; }
    public bool? IsRegulatoryDeadlinePending { get; init; }
    public bool? RequiresMedicalAttention { get; init; }
    public bool? ParentNotified { get; init; }
    public string? AcademicYear { get; init; }
    public string? Term { get; init; }
    public string SortBy { get; init; } = "IncidentDateTime";
    public string SortDirection { get; init; } = "desc";
}