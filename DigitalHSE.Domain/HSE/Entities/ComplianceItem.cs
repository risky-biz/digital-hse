using DigitalHSE.Domain.Common;

namespace DigitalHSE.Domain.HSE.Entities;

public class ComplianceItem : TrackableEntity
{
    // Basic Information
    public string ComplianceCode { get; private set; } = string.Empty;
    public string Title { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public string Category { get; private set; } = string.Empty; // Safety, Environmental, Health, Legal
    
    // Regulatory Information
    public string RegulatoryBody { get; private set; } = string.Empty;
    public string Regulation { get; private set; } = string.Empty;
    public string RegulationSection { get; private set; } = string.Empty;
    public string RequirementDetails { get; private set; } = string.Empty;
    
    // Compliance Details
    public DateTime EffectiveDate { get; private set; }
    public DateTime? ExpiryDate { get; private set; }
    public string ComplianceFrequency { get; private set; } = string.Empty; // Annual, Monthly, Quarterly, etc.
    public DateTime NextDueDate { get; private set; }
    public DateTime? LastCompletedDate { get; private set; }
    
    // Status
    public ComplianceStatus Status { get; private set; }
    public string ResponsibleDepartment { get; private set; } = string.Empty;
    public string ResponsiblePerson { get; private set; } = string.Empty;
    public string ResponsibleEmail { get; private set; } = string.Empty;
    
    // Evidence and Documentation
    public string EvidenceRequired { get; private set; } = string.Empty;
    public string EvidenceProvided { get; private set; } = string.Empty;
    public string DocumentUrls { get; private set; } = string.Empty; // JSON array
    public DateTime? LastAuditDate { get; private set; }
    public string LastAuditResult { get; private set; } = string.Empty;
    
    // Indonesian Specific Fields
    public bool IsIndonesianRegulation { get; private set; }
    public string IndonesianRegulationName { get; private set; } = string.Empty; // e.g., "UU No. 1 Tahun 1970"
    public string MinistryDepartment { get; private set; } = string.Empty; // e.g., "Kementerian Ketenagakerjaan"
    public bool RequiresBPJSCompliance { get; private set; }
    public bool RequiresGovernmentReporting { get; private set; }
    public string GovernmentReportingFrequency { get; private set; } = string.Empty;
    
    // Non-Compliance
    public bool IsInViolation { get; private set; }
    public DateTime? ViolationDate { get; private set; }
    public string ViolationDetails { get; private set; } = string.Empty;
    public string CorrectiveActions { get; private set; } = string.Empty;
    public DateTime? CorrectiveActionDeadline { get; private set; }
    
    // Constructor
    protected ComplianceItem() { } // EF Core
    
    public ComplianceItem(
        string title,
        string description,
        string category,
        string regulatoryBody,
        string regulation,
        DateTime effectiveDate,
        string complianceFrequency,
        string responsibleDepartment,
        string responsiblePerson,
        string responsibleEmail)
    {
        ComplianceCode = GenerateComplianceCode(category);
        Title = title;
        Description = description;
        Category = category;
        RegulatoryBody = regulatoryBody;
        Regulation = regulation;
        EffectiveDate = effectiveDate;
        ComplianceFrequency = complianceFrequency;
        ResponsibleDepartment = responsibleDepartment;
        ResponsiblePerson = responsiblePerson;
        ResponsibleEmail = responsibleEmail;
        Status = ComplianceStatus.Active;
        
        CalculateNextDueDate();
    }
    
    // Methods
    public void SetRegulationDetails(string section, string requirementDetails)
    {
        RegulationSection = section;
        RequirementDetails = requirementDetails;
    }
    
    public void SetIndonesianRegulation(
        string regulationName, 
        string ministryDepartment,
        bool requiresBPJS,
        bool requiresGovReporting,
        string reportingFrequency = "")
    {
        IsIndonesianRegulation = true;
        IndonesianRegulationName = regulationName;
        MinistryDepartment = ministryDepartment;
        RequiresBPJSCompliance = requiresBPJS;
        RequiresGovernmentReporting = requiresGovReporting;
        GovernmentReportingFrequency = reportingFrequency;
    }
    
    public void RecordCompliance(string evidenceProvided, List<string> documentUrls)
    {
        LastCompletedDate = DateTime.UtcNow;
        EvidenceProvided = evidenceProvided;
        DocumentUrls = System.Text.Json.JsonSerializer.Serialize(documentUrls);
        Status = ComplianceStatus.Compliant;
        IsInViolation = false;
        ViolationDate = null;
        ViolationDetails = string.Empty;
        
        CalculateNextDueDate();
    }
    
    public void RecordNonCompliance(string violationDetails)
    {
        Status = ComplianceStatus.NonCompliant;
        IsInViolation = true;
        ViolationDate = DateTime.UtcNow;
        ViolationDetails = violationDetails;
    }
    
    public void SetCorrectiveActions(string actions, DateTime deadline)
    {
        if (!IsInViolation)
            throw new InvalidOperationException("Corrective actions can only be set for violations");
            
        CorrectiveActions = actions;
        CorrectiveActionDeadline = deadline;
        Status = ComplianceStatus.PendingCorrectiveAction;
    }
    
    public void CompleteCorrectiveActions(string evidence)
    {
        if (Status != ComplianceStatus.PendingCorrectiveAction)
            throw new InvalidOperationException("No pending corrective actions");
            
        RecordCompliance(evidence, new List<string>());
        CorrectiveActions = $"COMPLETED: {CorrectiveActions}";
    }
    
    public void RecordAudit(string auditResult)
    {
        LastAuditDate = DateTime.UtcNow;
        LastAuditResult = auditResult;
    }
    
    public void UpdateResponsibility(string person, string email, string department)
    {
        ResponsiblePerson = person;
        ResponsibleEmail = email;
        ResponsibleDepartment = department;
    }
    
    public void Expire()
    {
        Status = ComplianceStatus.Expired;
        ExpiryDate = DateTime.UtcNow;
    }
    
    public void Reactivate(DateTime newEffectiveDate)
    {
        Status = ComplianceStatus.Active;
        EffectiveDate = newEffectiveDate;
        ExpiryDate = null;
        CalculateNextDueDate();
    }
    
    private void CalculateNextDueDate()
    {
        var baseDate = LastCompletedDate ?? EffectiveDate;
        
        NextDueDate = ComplianceFrequency.ToLower() switch
        {
            "daily" => baseDate.AddDays(1),
            "weekly" => baseDate.AddDays(7),
            "monthly" => baseDate.AddMonths(1),
            "quarterly" => baseDate.AddMonths(3),
            "semi-annual" => baseDate.AddMonths(6),
            "annual" => baseDate.AddYears(1),
            "biennial" => baseDate.AddYears(2),
            _ => baseDate.AddYears(1) // Default to annual
        };
    }
    
    private static string GenerateComplianceCode(string category)
    {
        var categoryPrefix = category.ToUpper() switch
        {
            "SAFETY" => "SAF",
            "ENVIRONMENTAL" => "ENV",
            "HEALTH" => "HLT",
            "LEGAL" => "LEG",
            _ => "CMP"
        };
        
        var timestamp = DateTime.UtcNow.ToString("yyyyMMdd");
        var random = new Random().Next(100, 999);
        return $"{categoryPrefix}-{timestamp}-{random}";
    }
    
    // Business Rules
    public bool IsOverdue()
    {
        return DateTime.UtcNow > NextDueDate && Status != ComplianceStatus.Compliant;
    }
    
    public int DaysUntilDue()
    {
        return (NextDueDate - DateTime.UtcNow).Days;
    }
    
    public bool RequiresUrgentAction()
    {
        return IsOverdue() || (DaysUntilDue() <= 7 && Status != ComplianceStatus.Compliant);
    }
    
    public List<string> GetDocuments()
    {
        return string.IsNullOrEmpty(DocumentUrls) 
            ? new List<string>() 
            : System.Text.Json.JsonSerializer.Deserialize<List<string>>(DocumentUrls) ?? new List<string>();
    }
}

public enum ComplianceStatus
{
    Active = 1,
    Compliant = 2,
    NonCompliant = 3,
    PendingCorrectiveAction = 4,
    Expired = 5,
    UnderReview = 6
}