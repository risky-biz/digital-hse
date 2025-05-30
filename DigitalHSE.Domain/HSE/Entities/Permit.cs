using DigitalHSE.Domain.Common;
using DigitalHSE.Domain.HSE.Enums;

namespace DigitalHSE.Domain.HSE.Entities;

public class Permit : TrackableEntity
{
    // Basic Information
    public string PermitNumber { get; private set; } = string.Empty;
    public PermitType Type { get; private set; }
    public PermitStatus Status { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    
    // Work Details
    public string WorkLocation { get; private set; } = string.Empty;
    public string Department { get; private set; } = string.Empty;
    public string Equipment { get; private set; } = string.Empty;
    public string WorkScope { get; private set; } = string.Empty;
    public int EstimatedWorkers { get; private set; }
    
    // Timing
    public DateTime RequestedStartDate { get; private set; }
    public DateTime RequestedEndDate { get; private set; }
    public DateTime? ActualStartDate { get; private set; }
    public DateTime? ActualEndDate { get; private set; }
    public TimeSpan EstimatedDuration => RequestedEndDate - RequestedStartDate;
    
    // People
    public string RequestedBy { get; private set; } = string.Empty;
    public string RequestorEmail { get; private set; } = string.Empty;
    public string RequestorPhone { get; private set; } = string.Empty;
    public string Supervisor { get; private set; } = string.Empty;
    public string SupervisorPhone { get; private set; } = string.Empty;
    public string Contractor { get; private set; } = string.Empty;
    
    // Safety Requirements
    public string Hazards { get; private set; } = string.Empty;
    public string ControlMeasures { get; private set; } = string.Empty;
    public string RequiredPPE { get; private set; } = string.Empty;
    public string EmergencyProcedures { get; private set; } = string.Empty;
    public bool RequiresIsolation { get; private set; }
    public string IsolationDetails { get; private set; } = string.Empty;
    
    // Approvals
    public string PreparedBy { get; private set; } = string.Empty;
    public DateTime? PreparedDate { get; private set; }
    public string ReviewedBy { get; private set; } = string.Empty;
    public DateTime? ReviewedDate { get; private set; }
    public string ApprovedBy { get; private set; } = string.Empty;
    public DateTime? ApprovedDate { get; private set; }
    public string ApprovalComments { get; private set; } = string.Empty;
    
    // Closure
    public string ClosedBy { get; private set; } = string.Empty;
    public DateTime? ClosedDate { get; private set; }
    public string ClosureComments { get; private set; } = string.Empty;
    public bool WorkCompleted { get; private set; }
    
    // Special Requirements (Indonesian Context)
    public bool RequiresSIKB { get; private set; } // Surat Izin Kerja Berbahaya
    public string SIKBNumber { get; private set; } = string.Empty;
    public bool RequiresK3Approval { get; private set; } // K3 = Keselamatan dan Kesehatan Kerja
    public string K3ApprovalNumber { get; private set; } = string.Empty;
    
    // Risk Assessment Link
    public int? RiskAssessmentId { get; private set; }
    
    // Attachments
    public string AttachmentUrls { get; private set; } = string.Empty; // JSON array
    
    // Constructor
    protected Permit() { } // EF Core
    
    public Permit(
        PermitType type,
        string title,
        string description,
        string workLocation,
        string department,
        DateTime requestedStartDate,
        DateTime requestedEndDate,
        string requestedBy,
        string requestorEmail,
        string supervisor)
    {
        if (requestedEndDate <= requestedStartDate)
            throw new ArgumentException("End date must be after start date");
            
        PermitNumber = GeneratePermitNumber(type);
        Type = type;
        Status = PermitStatus.Draft;
        Title = title;
        Description = description;
        WorkLocation = workLocation;
        Department = department;
        RequestedStartDate = requestedStartDate;
        RequestedEndDate = requestedEndDate;
        RequestedBy = requestedBy;
        RequestorEmail = requestorEmail;
        Supervisor = supervisor;
    }
    
    // Methods
    public void SetWorkDetails(string workScope, string equipment, int estimatedWorkers, string contractor)
    {
        WorkScope = workScope;
        Equipment = equipment;
        EstimatedWorkers = estimatedWorkers;
        Contractor = contractor;
    }
    
    public void SetSafetyRequirements(
        string hazards, 
        string controlMeasures, 
        string requiredPPE, 
        string emergencyProcedures)
    {
        Hazards = hazards;
        ControlMeasures = controlMeasures;
        RequiredPPE = requiredPPE;
        EmergencyProcedures = emergencyProcedures;
    }
    
    public void SetIsolationRequirements(bool required, string details = "")
    {
        RequiresIsolation = required;
        IsolationDetails = details;
    }
    
    public void LinkRiskAssessment(int riskAssessmentId)
    {
        RiskAssessmentId = riskAssessmentId;
    }
    
    public void SubmitForApproval(string preparedBy)
    {
        ValidateForSubmission();
        Status = PermitStatus.PendingApproval;
        PreparedBy = preparedBy;
        PreparedDate = DateTime.UtcNow;
    }
    
    public void Review(string reviewedBy, string comments = "")
    {
        ReviewedBy = reviewedBy;
        ReviewedDate = DateTime.UtcNow;
        if (!string.IsNullOrEmpty(comments))
            ApprovalComments = $"Review: {comments}";
    }
    
    public void Approve(string approvedBy, string comments = "")
    {
        if (Status != PermitStatus.PendingApproval)
            throw new InvalidOperationException("Permit must be pending approval");
            
        Status = PermitStatus.Approved;
        ApprovedBy = approvedBy;
        ApprovedDate = DateTime.UtcNow;
        ApprovalComments = comments;
    }
    
    public void Reject(string rejectedBy, string reason)
    {
        if (Status != PermitStatus.PendingApproval)
            throw new InvalidOperationException("Permit must be pending approval");
            
        Status = PermitStatus.Draft;
        ApprovalComments = $"Rejected by {rejectedBy}: {reason}";
    }
    
    public void StartWork()
    {
        if (Status != PermitStatus.Approved)
            throw new InvalidOperationException("Permit must be approved before starting work");
            
        if (DateTime.UtcNow > RequestedEndDate)
            throw new InvalidOperationException("Permit has expired");
            
        Status = PermitStatus.Active;
        ActualStartDate = DateTime.UtcNow;
    }
    
    public void SuspendWork(string suspendedBy, string reason)
    {
        if (Status != PermitStatus.Active)
            throw new InvalidOperationException("Can only suspend active permits");
            
        Status = PermitStatus.Suspended;
        ClosureComments = $"Suspended by {suspendedBy}: {reason}";
    }
    
    public void ResumeWork()
    {
        if (Status != PermitStatus.Suspended)
            throw new InvalidOperationException("Can only resume suspended permits");
            
        Status = PermitStatus.Active;
    }
    
    public void CompleteWork(string closedBy, string comments, bool workCompleted)
    {
        if (Status != PermitStatus.Active)
            throw new InvalidOperationException("Can only complete active permits");
            
        Status = PermitStatus.Completed;
        ClosedBy = closedBy;
        ClosedDate = DateTime.UtcNow;
        ActualEndDate = DateTime.UtcNow;
        ClosureComments = comments;
        WorkCompleted = workCompleted;
    }
    
    public void Cancel(string cancelledBy, string reason)
    {
        if (Status == PermitStatus.Completed || Status == PermitStatus.Cancelled)
            throw new InvalidOperationException("Cannot cancel completed or already cancelled permits");
            
        Status = PermitStatus.Cancelled;
        ClosureComments = $"Cancelled by {cancelledBy}: {reason}";
        ClosedDate = DateTime.UtcNow;
    }
    
    public void ExpirePermit()
    {
        if (Status == PermitStatus.Active && DateTime.UtcNow > RequestedEndDate)
        {
            Status = PermitStatus.Expired;
            ClosureComments = "Permit expired automatically";
            ClosedDate = DateTime.UtcNow;
        }
    }
    
    // Indonesian Regulatory
    public void SetSIKBRequirement(bool required, string sikbNumber = "")
    {
        RequiresSIKB = required;
        SIKBNumber = sikbNumber;
    }
    
    public void SetK3Requirement(bool required, string approvalNumber = "")
    {
        RequiresK3Approval = required;
        K3ApprovalNumber = approvalNumber;
    }
    
    private void ValidateForSubmission()
    {
        var errors = new List<string>();
        
        if (string.IsNullOrEmpty(WorkScope))
            errors.Add("Work scope is required");
            
        if (string.IsNullOrEmpty(Hazards))
            errors.Add("Hazards identification is required");
            
        if (string.IsNullOrEmpty(ControlMeasures))
            errors.Add("Control measures are required");
            
        if (string.IsNullOrEmpty(RequiredPPE))
            errors.Add("Required PPE must be specified");
            
        if (string.IsNullOrEmpty(EmergencyProcedures))
            errors.Add("Emergency procedures are required");
            
        if (EstimatedWorkers <= 0)
            errors.Add("Number of workers must be specified");
            
        if (errors.Any())
            throw new InvalidOperationException($"Permit validation failed: {string.Join(", ", errors)}");
    }
    
    private static string GeneratePermitNumber(PermitType type)
    {
        var typePrefix = type switch
        {
            PermitType.HotWork => "HW",
            PermitType.ConfinedSpace => "CS",
            PermitType.WorkingAtHeight => "WH",
            PermitType.Excavation => "EX",
            PermitType.Electrical => "EL",
            PermitType.ColdWork => "CW",
            PermitType.GeneralWork => "GW",
            _ => "PTW"
        };
        
        var timestamp = DateTime.UtcNow.ToString("yyyyMMdd");
        var random = new Random().Next(100, 999);
        return $"{typePrefix}-{timestamp}-{random}";
    }
    
    // Attachment methods
    public void AddAttachments(List<string> urls)
    {
        AttachmentUrls = System.Text.Json.JsonSerializer.Serialize(urls);
    }
    
    public List<string> GetAttachments()
    {
        return string.IsNullOrEmpty(AttachmentUrls) 
            ? new List<string>() 
            : System.Text.Json.JsonSerializer.Deserialize<List<string>>(AttachmentUrls) ?? new List<string>();
    }
    
    // Business Rules
    public bool IsHighRisk()
    {
        return Type == PermitType.HotWork || 
               Type == PermitType.ConfinedSpace || 
               Type == PermitType.WorkingAtHeight;
    }
    
    public bool IsExpired()
    {
        return DateTime.UtcNow > RequestedEndDate;
    }
    
    public bool CanBeExtended()
    {
        return Status == PermitStatus.Active && !IsExpired();
    }
}