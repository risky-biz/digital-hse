using DigitalHSE.Domain.Common;
using DigitalHSE.Domain.HSE.Enums;

namespace DigitalHSE.Domain.HSE.Entities;

public class RiskAssessment : TrackableEntity
{
    // Basic Information
    public string AssessmentNumber { get; private set; } = string.Empty;
    public string Title { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public DateTime AssessmentDate { get; private set; }
    public DateTime? ReviewDate { get; private set; }
    public DateTime? NextReviewDate { get; private set; }
    
    // Risk Details
    public string Activity { get; private set; } = string.Empty;
    public string Location { get; private set; } = string.Empty;
    public string Department { get; private set; } = string.Empty;
    public string Hazards { get; private set; } = string.Empty;
    public string PotentialConsequences { get; private set; } = string.Empty;
    
    // Risk Scoring (Before Controls)
    public int InitialLikelihood { get; private set; } // 1-5
    public int InitialConsequence { get; private set; } // 1-5
    public int InitialRiskScore { get; private set; } // Likelihood x Consequence
    public RiskLevel InitialRiskLevel { get; private set; }
    
    // Control Measures
    public string ExistingControls { get; private set; } = string.Empty;
    public string AdditionalControls { get; private set; } = string.Empty;
    public string ResponsiblePerson { get; private set; } = string.Empty;
    public DateTime? ImplementationDeadline { get; private set; }
    
    // Risk Scoring (After Controls)
    public int ResidualLikelihood { get; private set; } // 1-5
    public int ResidualConsequence { get; private set; } // 1-5
    public int ResidualRiskScore { get; private set; } // Likelihood x Consequence
    public RiskLevel ResidualRiskLevel { get; private set; }
    
    // Assessment Details
    public string AssessedBy { get; private set; } = string.Empty;
    public string ApprovedBy { get; private set; } = string.Empty;
    public DateTime? ApprovedDate { get; private set; }
    public bool IsApproved { get; private set; }
    public bool IsActive { get; private set; }
    
    // Indonesian Regulatory
    public string RegulatoryRequirements { get; private set; } = string.Empty;
    public bool RequiresGovernmentNotification { get; private set; }
    public DateTime? GovernmentNotificationDate { get; private set; }
    
    // Attachments
    public string AttachmentUrls { get; private set; } = string.Empty; // JSON array
    
    // Constructor
    protected RiskAssessment() { } // EF Core
    
    public RiskAssessment(
        string title,
        string description,
        string activity,
        string location,
        string department,
        string hazards,
        string assessedBy)
    {
        AssessmentNumber = GenerateAssessmentNumber();
        Title = title;
        Description = description;
        AssessmentDate = DateTime.UtcNow;
        Activity = activity;
        Location = location;
        Department = department;
        Hazards = hazards;
        AssessedBy = assessedBy;
        IsActive = true;
        
        // Set default review date (1 year from assessment)
        NextReviewDate = DateTime.UtcNow.AddYears(1);
    }
    
    // Methods
    public void SetInitialRisk(int likelihood, int consequence, string potentialConsequences)
    {
        if (likelihood < 1 || likelihood > 5)
            throw new ArgumentException("Likelihood must be between 1 and 5");
            
        if (consequence < 1 || consequence > 5)
            throw new ArgumentException("Consequence must be between 1 and 5");
            
        InitialLikelihood = likelihood;
        InitialConsequence = consequence;
        InitialRiskScore = likelihood * consequence;
        InitialRiskLevel = CalculateRiskLevel(InitialRiskScore);
        PotentialConsequences = potentialConsequences;
    }
    
    public void SetControlMeasures(
        string existingControls, 
        string additionalControls, 
        string responsiblePerson,
        DateTime? implementationDeadline)
    {
        ExistingControls = existingControls;
        AdditionalControls = additionalControls;
        ResponsiblePerson = responsiblePerson;
        ImplementationDeadline = implementationDeadline;
    }
    
    public void SetResidualRisk(int likelihood, int consequence)
    {
        if (likelihood < 1 || likelihood > 5)
            throw new ArgumentException("Likelihood must be between 1 and 5");
            
        if (consequence < 1 || consequence > 5)
            throw new ArgumentException("Consequence must be between 1 and 5");
            
        ResidualLikelihood = likelihood;
        ResidualConsequence = consequence;
        ResidualRiskScore = likelihood * consequence;
        ResidualRiskLevel = CalculateRiskLevel(ResidualRiskScore);
    }
    
    public void Approve(string approvedBy)
    {
        if (InitialRiskScore == 0)
            throw new InvalidOperationException("Cannot approve assessment without initial risk scoring");
            
        if (string.IsNullOrEmpty(ExistingControls) && string.IsNullOrEmpty(AdditionalControls))
            throw new InvalidOperationException("Cannot approve assessment without control measures");
            
        ApprovedBy = approvedBy;
        ApprovedDate = DateTime.UtcNow;
        IsApproved = true;
    }
    
    public void Review(string reviewedBy)
    {
        ReviewDate = DateTime.UtcNow;
        NextReviewDate = DateTime.UtcNow.AddYears(1);
        UpdatedAt = DateTime.UtcNow;
        UpdatedBy = reviewedBy;
    }
    
    public void Deactivate()
    {
        IsActive = false;
    }
    
    public void SetRegulatoryRequirements(string requirements, bool requiresNotification)
    {
        RegulatoryRequirements = requirements;
        RequiresGovernmentNotification = requiresNotification;
    }
    
    public void RecordGovernmentNotification()
    {
        GovernmentNotificationDate = DateTime.UtcNow;
    }
    
    private static RiskLevel CalculateRiskLevel(int riskScore)
    {
        return riskScore switch
        {
            >= 20 => RiskLevel.Extreme,
            >= 15 => RiskLevel.High,
            >= 10 => RiskLevel.Medium,
            _ => RiskLevel.Low
        };
    }
    
    private static string GenerateAssessmentNumber()
    {
        var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
        var random = new Random().Next(1000, 9999);
        return $"RA-{timestamp}-{random}";
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
    public bool RequiresUrgentAction()
    {
        return InitialRiskLevel == RiskLevel.Extreme || InitialRiskLevel == RiskLevel.High;
    }
    
    public bool IsOverdue()
    {
        return NextReviewDate.HasValue && NextReviewDate.Value < DateTime.UtcNow;
    }
    
    public bool IsEffective()
    {
        return ResidualRiskScore > 0 && ResidualRiskScore < InitialRiskScore;
    }
}