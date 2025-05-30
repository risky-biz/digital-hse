using DigitalHSE.Domain.HSE.Enums;

namespace DigitalHSE.Application.ViewModels;

public class IncidentListViewModel
{
    public int Id { get; set; }
    public string IncidentNumber { get; set; } = string.Empty;
    public DateTime IncidentDateTime { get; set; }
    public DateTime ReportedDateTime { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    // Enhanced Classification
    public IncidentCategory Category { get; set; }
    public string CategoryDisplay { get; set; } = string.Empty;
    public IncidentType Type { get; set; }
    public string TypeDisplay { get; set; } = string.Empty;
    public IncidentSeverity Severity { get; set; }
    public string SeverityDisplay { get; set; } = string.Empty;
    public IncidentUrgency Urgency { get; set; }
    public string UrgencyDisplay { get; set; } = string.Empty;
    public IncidentStatus Status { get; set; }
    public string StatusDisplay { get; set; } = string.Empty;
    public InvestigationStatus InvestigationStatus { get; set; }
    public string InvestigationStatusDisplay { get; set; } = string.Empty;
    
    // Location Information
    public string Location { get; set; } = string.Empty;
    public string Building { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string SpecificLocation { get; set; } = string.Empty;
    
    // Reporter Information
    public string ReportedBy { get; set; } = string.Empty;
    public PersonType ReporterType { get; set; }
    public string ReporterTypeDisplay { get; set; } = string.Empty;
    public bool IsAnonymous { get; set; }
    public string? AnonymousTrackingCode { get; set; }
    
    // Person Affected Information
    public PersonType? PersonAffectedType { get; set; }
    public string PersonAffectedName { get; set; } = string.Empty;
    public string PersonAffectedId { get; set; } = string.Empty;
    public string PersonAffectedClass { get; set; } = string.Empty;
    public bool IsStudentIncident { get; set; }
    
    // Investigation Information
    public string InvestigatedBy { get; set; } = string.Empty;
    public DateTime? InvestigationStartDate { get; set; }
    public DateTime? InvestigationDueDate { get; set; }
    public DateTime? InvestigationCompletedDate { get; set; }
    
    // Status Indicators
    public bool RequiresMedicalAttention { get; set; }
    public bool EmergencyServicesNotified { get; set; }
    public bool ParentNotified { get; set; }
    public bool ParentAcknowledgment { get; set; }
    public bool RequiresBPJSReporting { get; set; }
    public bool RequiresMinistryReporting { get; set; }
    public bool IsRegulatoryOverdue { get; set; }
    public DateTime? RegulatoryDeadline { get; set; }
    public bool RegulatoryDeadlineMet { get; set; }
    
    // School Context
    public string AcademicYear { get; set; } = string.Empty;
    public string Term { get; set; } = string.Empty;
    public string ActivityType { get; set; } = string.Empty;
    public string TeacherInCharge { get; set; } = string.Empty;
    
    // Investigation and CAPA Status
    public bool HasActiveInvestigation { get; set; }
    public bool IsInvestigationOverdue { get; set; }
    public int PendingCAPAs { get; set; }
    public int OverdueCAPAs { get; set; }
    
    // Display helpers
    public string SeverityBadgeClass => Severity switch
    {
        IncidentSeverity.Critical => "danger",
        IncidentSeverity.Major => "warning",
        IncidentSeverity.Moderate => "info",
        IncidentSeverity.Low => "light",
        IncidentSeverity.Minor => "light",
        _ => "secondary"
    };
    
    public string StatusBadgeClass => Status switch
    {
        IncidentStatus.Open => "primary",
        IncidentStatus.UnderInvestigation => "warning",
        IncidentStatus.AwaitingApproval => "info",
        IncidentStatus.Closed => "success",
        IncidentStatus.Cancelled => "secondary",
        _ => "secondary"
    };
    
    public string TypeIcon => Type switch
    {
        IncidentType.StudentInjury => "child",
        IncidentType.StaffInjury => "user-injured",
        IncidentType.TeacherInjury => "chalkboard-teacher",
        IncidentType.PlaygroundAccident => "playground",
        IncidentType.SportsInjury => "football-ball",
        IncidentType.LaboratoryAccident => "flask",
        IncidentType.FieldTripIncident => "bus",
        IncidentType.BehavioralIncident => "exclamation-triangle",
        IncidentType.BullyingIncident => "hand-rock",
        IncidentType.SecurityIncident => "shield-alt",
        IncidentType.Fire => "fire",
        IncidentType.PropertyDamage => "hammer",
        IncidentType.Environmental => "leaf",
        IncidentType.NearMiss => "eye",
        _ => "exclamation-circle"
    };
    
    public bool IsUrgent => Severity >= IncidentSeverity.Major || 
                           IsRegulatoryOverdue || 
                           IsInvestigationOverdue ||
                           OverdueCAPAs > 0;
    
    public List<string> UrgencyReasons
    {
        get
        {
            var reasons = new List<string>();
            if (Severity >= IncidentSeverity.Major) reasons.Add("High severity incident");
            if (IsRegulatoryOverdue) reasons.Add("Regulatory reporting overdue");
            if (IsInvestigationOverdue) reasons.Add("Investigation overdue");
            if (OverdueCAPAs > 0) reasons.Add($"{OverdueCAPAs} overdue corrective actions");
            return reasons;
        }
    }
    
    public int DaysOld => (DateTime.UtcNow - IncidentDateTime).Days;
    
    public string AgeDisplay => DaysOld switch
    {
        0 => "Today",
        1 => "Yesterday",
        < 7 => $"{DaysOld} days ago",
        < 30 => $"{DaysOld / 7} weeks ago",
        _ => $"{DaysOld / 30} months ago"
    };
}