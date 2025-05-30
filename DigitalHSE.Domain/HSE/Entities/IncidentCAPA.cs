using DigitalHSE.Domain.Common;

namespace DigitalHSE.Domain.HSE.Entities;

public class IncidentCAPA : TrackableEntity
{
    public int IncidentId { get; private set; }
    public virtual Incident Incident { get; private set; } = null!;
    
    public string ActionNumber { get; private set; } = string.Empty;
    public string Title { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public CAPAType Type { get; private set; }
    public CAPAPriority Priority { get; private set; }
    public CAPAStatus Status { get; private set; }
    
    // Assignment
    public string AssignedTo { get; private set; } = string.Empty;
    public string AssignedByName { get; private set; } = string.Empty;
    public DateTime AssignedDate { get; private set; }
    public DateTime DueDate { get; private set; }
    public DateTime? CompletionDate { get; private set; }
    
    // Progress Tracking
    public int ProgressPercentage { get; private set; }
    public string ProgressNotes { get; private set; } = string.Empty;
    public string CompletionEvidence { get; private set; } = string.Empty; // URLs to evidence files
    
    // Verification
    public string VerifiedBy { get; private set; } = string.Empty;
    public DateTime? VerificationDate { get; private set; }
    public bool IsEffective { get; private set; }
    public string EffectivenessNotes { get; private set; } = string.Empty;
    
    // Cost Tracking
    public decimal EstimatedCost { get; private set; }
    public decimal ActualCost { get; private set; }
    public string CostNotes { get; private set; } = string.Empty;
    
    protected IncidentCAPA() { } // EF Core
    
    public IncidentCAPA(
        int incidentId,
        string title,
        string description,
        CAPAType type,
        CAPAPriority priority,
        string assignedTo,
        string assignedBy,
        DateTime dueDate)
    {
        IncidentId = incidentId;
        ActionNumber = GenerateActionNumber();
        Title = title;
        Description = description;
        Type = type;
        Priority = priority;
        AssignedTo = assignedTo;
        AssignedByName = assignedBy;
        AssignedDate = DateTime.UtcNow;
        DueDate = dueDate;
        Status = CAPAStatus.Assigned;
        ProgressPercentage = 0;
    }
    
    public void StartAction()
    {
        Status = CAPAStatus.InProgress;
        ProgressPercentage = 10;
    }
    
    public void UpdateProgress(int percentage, string notes)
    {
        ProgressPercentage = Math.Clamp(percentage, 0, 100);
        ProgressNotes = notes;
        
        if (percentage >= 100)
        {
            Status = CAPAStatus.AwaitingVerification;
        }
    }
    
    public void CompleteAction(string evidence, decimal actualCost = 0)
    {
        CompletionDate = DateTime.UtcNow;
        CompletionEvidence = evidence;
        ActualCost = actualCost;
        Status = CAPAStatus.AwaitingVerification;
        ProgressPercentage = 100;
    }
    
    public void VerifyAction(string verifiedBy, bool isEffective, string notes)
    {
        VerifiedBy = verifiedBy;
        VerificationDate = DateTime.UtcNow;
        IsEffective = isEffective;
        EffectivenessNotes = notes;
        Status = isEffective ? CAPAStatus.Verified : CAPAStatus.RequiresRevision;
    }
    
    public void CloseAction()
    {
        Status = CAPAStatus.Closed;
    }
    
    public void ExtendDueDate(DateTime newDueDate, string reason)
    {
        DueDate = newDueDate;
        ProgressNotes += $"\n[{DateTime.UtcNow:yyyy-MM-dd}] Due date extended: {reason}";
    }
    
    public bool IsOverdue()
    {
        return DateTime.UtcNow > DueDate && Status != CAPAStatus.Closed && Status != CAPAStatus.Verified;
    }
    
    private static string GenerateActionNumber()
    {
        var timestamp = DateTime.UtcNow.ToString("yyyyMMdd");
        var random = new Random().Next(100, 999);
        return $"CAPA-{timestamp}-{random}";
    }
}

public enum CAPAType
{
    Corrective = 1,     // Fix the immediate issue
    Preventive = 2,     // Prevent recurrence
    Improvement = 3     // Process improvement
}

public enum CAPAPriority
{
    Low = 1,
    Medium = 2,
    High = 3,
    Critical = 4
}

public enum CAPAStatus
{
    Assigned = 1,
    InProgress = 2,
    AwaitingVerification = 3,
    Verified = 4,
    RequiresRevision = 5,
    Closed = 6,
    Cancelled = 7
}