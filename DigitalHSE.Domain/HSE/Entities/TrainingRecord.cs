using DigitalHSE.Domain.Common;

namespace DigitalHSE.Domain.HSE.Entities;

public class TrainingRecord : TrackableEntity
{
    // Basic Information
    public string RecordNumber { get; private set; } = string.Empty;
    public string EmployeeId { get; private set; } = string.Empty;
    public string EmployeeName { get; private set; } = string.Empty;
    public string EmployeeEmail { get; private set; } = string.Empty;
    public string Department { get; private set; } = string.Empty;
    public string Position { get; private set; } = string.Empty;
    
    // Training Details
    public string TrainingTitle { get; private set; } = string.Empty;
    public string TrainingType { get; private set; } = string.Empty; // Safety, Health, Environmental, Emergency Response
    public string TrainingCategory { get; private set; } = string.Empty; // Mandatory, Refresher, Specialized
    public string TrainingProvider { get; private set; } = string.Empty;
    public string Instructor { get; private set; } = string.Empty;
    public string Location { get; private set; } = string.Empty;
    
    // Schedule
    public DateTime TrainingDate { get; private set; }
    public TimeSpan Duration { get; private set; }
    public DateTime? ExpiryDate { get; private set; }
    public bool RequiresRefresher { get; private set; }
    public int RefresherFrequencyMonths { get; private set; }
    
    // Completion
    public bool IsCompleted { get; private set; }
    public DateTime? CompletionDate { get; private set; }
    public decimal? Score { get; private set; }
    public bool Passed { get; private set; }
    public string CertificateNumber { get; private set; } = string.Empty;
    public string CertificateUrl { get; private set; } = string.Empty;
    
    // Indonesian Regulatory
    public bool IsRegulatoryRequired { get; private set; }
    public string RegulatoryReference { get; private set; } = string.Empty;
    public bool RequiresSKKK { get; private set; } // Sertifikat Keterampilan Kerja Khusus
    public string SKKKNumber { get; private set; } = string.Empty;
    public bool RequiresKemnaker { get; private set; } // Kementerian Ketenagakerjaan
    public string KemnakerNumber { get; private set; } = string.Empty;
    
    // Attachments
    public string MaterialUrls { get; private set; } = string.Empty; // JSON array
    public string AttendanceUrl { get; private set; } = string.Empty;
    
    // Constructor
    protected TrainingRecord() { } // EF Core
    
    public TrainingRecord(
        string employeeId,
        string employeeName,
        string employeeEmail,
        string department,
        string position,
        string trainingTitle,
        string trainingType,
        string trainingCategory,
        DateTime trainingDate,
        TimeSpan duration)
    {
        RecordNumber = GenerateRecordNumber();
        EmployeeId = employeeId;
        EmployeeName = employeeName;
        EmployeeEmail = employeeEmail;
        Department = department;
        Position = position;
        TrainingTitle = trainingTitle;
        TrainingType = trainingType;
        TrainingCategory = trainingCategory;
        TrainingDate = trainingDate;
        Duration = duration;
        IsCompleted = false;
    }
    
    // Methods
    public void SetTrainingProvider(string provider, string instructor, string location)
    {
        TrainingProvider = provider;
        Instructor = instructor;
        Location = location;
    }
    
    public void SetRefresherRequirement(bool required, int frequencyMonths = 12)
    {
        RequiresRefresher = required;
        RefresherFrequencyMonths = frequencyMonths;
        
        if (required && CompletionDate.HasValue)
        {
            ExpiryDate = CompletionDate.Value.AddMonths(frequencyMonths);
        }
    }
    
    public void CompleteTraining(decimal? score = null, bool passed = true)
    {
        IsCompleted = true;
        CompletionDate = DateTime.UtcNow;
        Score = score;
        Passed = passed;
        
        if (RequiresRefresher)
        {
            ExpiryDate = CompletionDate.Value.AddMonths(RefresherFrequencyMonths);
        }
    }
    
    public void RecordCertificate(string certificateNumber, string certificateUrl)
    {
        if (!IsCompleted || !Passed)
            throw new InvalidOperationException("Certificate can only be recorded for completed and passed training");
            
        CertificateNumber = certificateNumber;
        CertificateUrl = certificateUrl;
    }
    
    public void SetRegulatoryRequirement(bool required, string reference)
    {
        IsRegulatoryRequired = required;
        RegulatoryReference = reference;
    }
    
    public void RecordSKKK(string skkkNumber)
    {
        RequiresSKKK = true;
        SKKKNumber = skkkNumber;
    }
    
    public void RecordKemnaker(string kemnakerNumber)
    {
        RequiresKemnaker = true;
        KemnakerNumber = kemnakerNumber;
    }
    
    public void ExtendExpiry(int additionalMonths)
    {
        if (!ExpiryDate.HasValue)
            throw new InvalidOperationException("No expiry date to extend");
            
        ExpiryDate = ExpiryDate.Value.AddMonths(additionalMonths);
    }
    
    // Business Rules
    public bool IsExpired()
    {
        return ExpiryDate.HasValue && ExpiryDate.Value < DateTime.UtcNow;
    }
    
    public bool IsExpiringSoon(int daysThreshold = 30)
    {
        if (!ExpiryDate.HasValue) return false;
        
        var daysUntilExpiry = (ExpiryDate.Value - DateTime.UtcNow).Days;
        return daysUntilExpiry > 0 && daysUntilExpiry <= daysThreshold;
    }
    
    public bool RequiresRenewal()
    {
        return RequiresRefresher && (IsExpired() || IsExpiringSoon());
    }
    
    private static string GenerateRecordNumber()
    {
        var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
        var random = new Random().Next(100, 999);
        return $"TR-{timestamp}-{random}";
    }
    
    // Attachment methods
    public void AddMaterials(List<string> urls)
    {
        MaterialUrls = System.Text.Json.JsonSerializer.Serialize(urls);
    }
    
    public void SetAttendanceSheet(string url)
    {
        AttendanceUrl = url;
    }
    
    public List<string> GetMaterials()
    {
        return string.IsNullOrEmpty(MaterialUrls) 
            ? new List<string>() 
            : System.Text.Json.JsonSerializer.Deserialize<List<string>>(MaterialUrls) ?? new List<string>();
    }
}