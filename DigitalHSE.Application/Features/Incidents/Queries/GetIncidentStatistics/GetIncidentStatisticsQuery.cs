using DigitalHSE.Application.Common;

namespace DigitalHSE.Application.Features.Incidents.Queries.GetIncidentStatistics;

public record GetIncidentStatisticsQuery : ICommandQuery<IncidentStatisticsViewModel>
{
    public DateTime? DateFrom { get; init; }
    public DateTime? DateTo { get; init; }
    public string? Department { get; init; }
    public string? Building { get; init; }
    public string? AcademicYear { get; init; }
    public string? Term { get; init; }
    public bool IncludeStudentBreakdown { get; init; } = true;
    public bool IncludeTrendAnalysis { get; init; } = true;
    public bool IncludeRegulatoryMetrics { get; init; } = true;
}

public class IncidentStatisticsViewModel
{
    public int TotalIncidents { get; set; }
    public int OpenIncidents { get; set; }
    public int ClosedIncidents { get; set; }
    public int OverdueInvestigations { get; set; }
    public int StudentIncidents { get; set; }
    public int StaffIncidents { get; set; }
    public int VisitorIncidents { get; set; }
    public int HighSeverityIncidents { get; set; }
    public int MedicalAttentionRequired { get; set; }
    public int RegulatoryReportingRequired { get; set; }
    public int ParentNotificationsSent { get; set; }
    public int PendingBPJSReports { get; set; }
    public int PendingMinistryReports { get; set; }
    public Dictionary<string, int> IncidentsByCategory { get; set; } = new();
    public Dictionary<string, int> IncidentsByLocation { get; set; } = new();
    public Dictionary<string, int> IncidentsByMonth { get; set; } = new();
    public Dictionary<string, int> IncidentsByDayOfWeek { get; set; } = new();
    public Dictionary<string, int> IncidentsByTimeOfDay { get; set; } = new();
    public double AverageInvestigationTime { get; set; }
    public double RegulatoryComplianceRate { get; set; }
    public double ParentNotificationRate { get; set; }
}