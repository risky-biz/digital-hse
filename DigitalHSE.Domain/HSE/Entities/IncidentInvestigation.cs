using DigitalHSE.Domain.Common;
using DigitalHSE.Domain.HSE.Enums;

namespace DigitalHSE.Domain.HSE.Entities;

public class IncidentInvestigation : TrackableEntity
{
    public int IncidentId { get; private set; }
    public virtual Incident Incident { get; private set; } = null!;
    
    // Investigation Team
    public string LeadInvestigator { get; private set; } = string.Empty;
    public string TeamMembers { get; private set; } = string.Empty; // JSON array
    public string TechnicalExperts { get; private set; } = string.Empty; // JSON array
    
    // Investigation Timeline
    public DateTime StartDate { get; private set; }
    public DateTime TargetCompletionDate { get; private set; }
    public DateTime? ActualCompletionDate { get; private set; }
    public InvestigationStatus Status { get; private set; }
    
    // Investigation Details
    public string InitialFindings { get; private set; } = string.Empty;
    public string Methodology { get; private set; } = string.Empty; // 5 Whys, Fishbone, etc.
    public string InterviewNotes { get; private set; } = string.Empty;
    public string EvidenceCollected { get; private set; } = string.Empty;
    public string WitnessStatements { get; private set; } = string.Empty;
    
    // Root Cause Analysis
    public string RootCauses { get; private set; } = string.Empty; // JSON array
    public string ContributingFactors { get; private set; } = string.Empty; // JSON array
    public string SystemicIssues { get; private set; } = string.Empty;
    
    // Recommendations
    public string ImmediateActions { get; private set; } = string.Empty;
    public string ShortTermActions { get; private set; } = string.Empty;
    public string LongTermActions { get; private set; } = string.Empty;
    public string PreventiveMeasures { get; private set; } = string.Empty;
    
    // Progress Tracking
    public int ProgressPercentage { get; private set; }
    public string ProgressNotes { get; private set; } = string.Empty;
    
    protected IncidentInvestigation() { } // EF Core
    
    public IncidentInvestigation(
        int incidentId,
        string leadInvestigator,
        DateTime targetCompletionDate)
    {
        IncidentId = incidentId;
        LeadInvestigator = leadInvestigator;
        StartDate = DateTime.UtcNow;
        TargetCompletionDate = targetCompletionDate;
        Status = InvestigationStatus.NotStarted;
        ProgressPercentage = 0;
    }
    
    public void StartInvestigation()
    {
        Status = InvestigationStatus.InProgress;
        ProgressPercentage = 10;
    }
    
    public void AddTeamMember(string memberName, string role)
    {
        var members = GetTeamMembers();
        members.Add(new { Name = memberName, Role = role });
        TeamMembers = System.Text.Json.JsonSerializer.Serialize(members);
    }
    
    public void RecordInitialFindings(string findings)
    {
        InitialFindings = findings;
        ProgressPercentage = Math.Max(ProgressPercentage, 25);
    }
    
    public void UpdateProgress(int percentage, string notes)
    {
        ProgressPercentage = Math.Clamp(percentage, 0, 100);
        ProgressNotes = notes;
    }
    
    public void CompleteInvestigation(
        string rootCauses,
        string recommendations)
    {
        RootCauses = rootCauses;
        ImmediateActions = recommendations;
        ActualCompletionDate = DateTime.UtcNow;
        Status = InvestigationStatus.Completed;
        ProgressPercentage = 100;
    }
    
    private List<object> GetTeamMembers()
    {
        return string.IsNullOrEmpty(TeamMembers) 
            ? new List<object>() 
            : System.Text.Json.JsonSerializer.Deserialize<List<object>>(TeamMembers) ?? new List<object>();
    }
}