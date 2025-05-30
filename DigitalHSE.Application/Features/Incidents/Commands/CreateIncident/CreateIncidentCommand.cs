using DigitalHSE.Application.Common;
using DigitalHSE.Domain.HSE.Enums;

namespace DigitalHSE.Application.Features.Incidents.Commands.CreateIncident;

public record CreateIncidentCommand : ICommandQuery<string>
{
    // Basic Information
    public DateTime IncidentDateTime { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public IncidentCategory Category { get; init; }
    public IncidentType Type { get; init; }
    public IncidentSeverity Severity { get; init; }
    public IncidentUrgency Urgency { get; init; }
    public bool IsAnonymous { get; init; }
    
    // Location Information
    public string Location { get; init; } = string.Empty;
    public string Building { get; init; } = string.Empty;
    public string Floor { get; init; } = string.Empty;
    public string Room { get; init; } = string.Empty;
    public string Department { get; init; } = string.Empty;
    public string SpecificLocation { get; init; } = string.Empty;
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
    public string? QRCodeLocation { get; init; }
    
    // Reporter Information
    public string ReportedBy { get; init; } = string.Empty;
    public string ReporterEmail { get; init; } = string.Empty;
    public string ReporterPhone { get; init; } = string.Empty;
    public PersonType ReporterType { get; init; }
    public string ReporterDepartment { get; init; } = string.Empty;
    
    // Person Affected
    public PersonType? PersonAffectedType { get; init; }
    public string PersonAffectedName { get; init; } = string.Empty;
    public string PersonAffectedId { get; init; } = string.Empty;
    public string PersonAffectedDepartment { get; init; } = string.Empty;
    public string PersonAffectedClass { get; init; } = string.Empty;
    public int? PersonAffectedAge { get; init; }
    public string PersonAffectedContact { get; init; } = string.Empty;
    
    // Witnesses
    public List<string> WitnessNames { get; init; } = new();
    public List<string> WitnessContacts { get; init; } = new();
    
    // Immediate Response
    public string ImmediateActions { get; init; } = string.Empty;
    public string FirstAidProvided { get; init; } = string.Empty;
    public bool EmergencyServicesNotified { get; init; }
    public string EmergencyServiceType { get; init; } = string.Empty;
    public bool RequiresMedicalAttention { get; init; }
    public string HospitalName { get; init; } = string.Empty;
    public string MedicalTreatmentDetails { get; init; } = string.Empty;
    
    // School Context
    public string ActivityType { get; init; } = string.Empty;
    public string SubjectClass { get; init; } = string.Empty;
    public string TeacherInCharge { get; init; } = string.Empty;
    public string SupervisorPresent { get; init; } = string.Empty;
    public int StudentsPresent { get; init; }
    public string WeatherConditions { get; init; } = string.Empty;
    public string LightingConditions { get; init; } = string.Empty;
    
    // Parent Information (for student incidents)
    public string ParentGuardianName { get; init; } = string.Empty;
    public string ParentGuardianContact { get; init; } = string.Empty;
    public string ParentGuardianEmail { get; init; } = string.Empty;
    public string ParentPreferredLanguage { get; init; } = "en";
    
    // Evidence
    public List<string> PhotoUrls { get; init; } = new();
    public List<string> VideoUrls { get; init; } = new();
    public List<string> DocumentUrls { get; init; } = new();
    
    // Regulatory Requirements
    public bool RequiresBPJSReporting { get; init; }
    public bool RequiresMinistryReporting { get; init; }
}