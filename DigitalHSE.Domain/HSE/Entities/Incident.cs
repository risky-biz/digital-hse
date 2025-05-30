using DigitalHSE.Domain.Common;
using DigitalHSE.Domain.HSE.Enums;

namespace DigitalHSE.Domain.HSE.Entities;

public class Incident : TrackableEntity
{
    // Basic Information
    public string IncidentNumber { get; private set; } = string.Empty;
    public DateTime IncidentDateTime { get; private set; }
    public DateTime ReportedDateTime { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    
    // Enhanced Classification based on Epic 1
    public IncidentCategory Category { get; private set; }
    public IncidentType Type { get; private set; }
    public IncidentSeverity Severity { get; private set; }
    public IncidentUrgency Urgency { get; private set; }
    public IncidentStatus Status { get; private set; }
    public bool IsAnonymous { get; private set; }
    
    // Location Information with GPS support
    public string Location { get; private set; } = string.Empty;
    public string Building { get; private set; } = string.Empty;
    public string Floor { get; private set; } = string.Empty;
    public string Room { get; private set; } = string.Empty;
    public string Department { get; private set; } = string.Empty;
    public string SpecificLocation { get; private set; } = string.Empty;
    public double? Latitude { get; private set; }
    public double? Longitude { get; private set; }
    public string? QRCodeLocation { get; private set; }
    
    // Reporter Information
    public string ReportedBy { get; private set; } = string.Empty;
    public string ReporterEmail { get; private set; } = string.Empty;
    public string ReporterPhone { get; private set; } = string.Empty;
    public PersonType ReporterType { get; private set; }
    public string ReporterDepartment { get; private set; } = string.Empty;
    public string AnonymousTrackingCode { get; private set; } = string.Empty;
    
    // Person(s) Involved - Enhanced for Epic 1
    public PersonType PersonAffectedType { get; private set; }
    public string PersonAffectedName { get; private set; } = string.Empty;
    public string PersonAffectedId { get; private set; } = string.Empty; // Student ID, Employee ID, etc.
    public string PersonAffectedDepartment { get; private set; } = string.Empty;
    public string PersonAffectedClass { get; private set; } = string.Empty; // For students
    public int? PersonAffectedAge { get; private set; }
    public string PersonAffectedContact { get; private set; } = string.Empty;
    
    // Witness Management
    public string WitnessNames { get; private set; } = string.Empty; // JSON array
    public string WitnessContacts { get; private set; } = string.Empty; // JSON array
    public bool WitnessStatementsCollected { get; private set; }
    
    // Immediate Response
    public string ImmediateActions { get; private set; } = string.Empty;
    public string FirstAidProvided { get; private set; } = string.Empty;
    public bool EmergencyServicesNotified { get; private set; }
    public DateTime? EmergencyServiceNotificationTime { get; private set; }
    public string EmergencyServiceType { get; private set; } = string.Empty; // Police, Ambulance, Fire
    public string HospitalName { get; private set; } = string.Empty;
    public bool RequiresMedicalAttention { get; private set; }
    public string MedicalTreatmentDetails { get; private set; } = string.Empty;
    
    // Investigation Information
    public InvestigationStatus InvestigationStatus { get; private set; }
    public string InvestigatedBy { get; private set; } = string.Empty;
    public DateTime? InvestigationStartDate { get; private set; }
    public DateTime? InvestigationCompletedDate { get; private set; }
    public DateTime? InvestigationDueDate { get; private set; }
    public string RootCauseAnalysis { get; private set; } = string.Empty;
    public string ContributingFactors { get; private set; } = string.Empty;
    public string LessonsLearned { get; private set; } = string.Empty;
    
    // Indonesian Regulatory Compliance
    public bool RequiresBPJSReporting { get; private set; }
    public string? BPJSReferenceNumber { get; private set; }
    public DateTime? BPJSReportedDate { get; private set; }
    public bool RequiresMinistryReporting { get; private set; }
    public string? MinistryReferenceNumber { get; private set; }
    public DateTime? MinistryReportedDate { get; private set; }
    public DateTime? RegulatoryDeadline { get; private set; }
    public bool RegulatoryDeadlineMet { get; private set; }
    public string P2K3ReviewStatus { get; private set; } = string.Empty;
    public DateTime? P2K3ReviewDate { get; private set; }
    
    // Parent/Guardian Communication (BSJ-specific)
    public string ParentGuardianName { get; private set; } = string.Empty;
    public string ParentGuardianContact { get; private set; } = string.Empty;
    public string ParentGuardianEmail { get; private set; } = string.Empty;
    public bool ParentNotified { get; private set; }
    public DateTime? ParentNotificationTime { get; private set; }
    public string ParentNotificationMethod { get; private set; } = string.Empty; // SMS, Email, Phone, WhatsApp
    public string ParentPreferredLanguage { get; private set; } = "en";
    public bool ParentAcknowledgment { get; private set; }
    public DateTime? ParentAcknowledgmentTime { get; private set; }
    
    // Insurance and Legal
    public bool InsuranceClaimInitiated { get; private set; }
    public string InsuranceClaimNumber { get; private set; } = string.Empty;
    public string InsuranceProvider { get; private set; } = string.Empty;
    public decimal EstimatedCosts { get; private set; }
    public decimal ActualCosts { get; private set; }
    public bool LegalActionRequired { get; private set; }
    public string LegalCaseNumber { get; private set; } = string.Empty;
    public string LegalStatus { get; private set; } = string.Empty;
    
    // Evidence and Documentation
    public string AttachmentUrls { get; private set; } = string.Empty; // JSON array
    public string PhotoUrls { get; private set; } = string.Empty; // JSON array
    public string VideoUrls { get; private set; } = string.Empty; // JSON array
    public string DocumentUrls { get; private set; } = string.Empty; // JSON array
    public string CCTVFootageUrls { get; private set; } = string.Empty; // JSON array
    public bool EvidenceChainOfCustody { get; private set; }
    
    // School-Specific Information
    public string AcademicYear { get; private set; } = string.Empty;
    public string Term { get; private set; } = string.Empty; // Term 1, Term 2, etc.
    public string ActivityType { get; private set; } = string.Empty; // Lesson, Break, Sports, etc.
    public string SubjectClass { get; private set; } = string.Empty; // For classroom incidents
    public string TeacherInCharge { get; private set; } = string.Empty;
    public string SupervisorPresent { get; private set; } = string.Empty;
    public int StudentsPresent { get; private set; }
    public string WeatherConditions { get; private set; } = string.Empty;
    public string LightingConditions { get; private set; } = string.Empty;
    
    // Follow-up and Closure
    public bool FollowUpRequired { get; private set; }
    public DateTime? NextFollowUpDate { get; private set; }
    public string FollowUpNotes { get; private set; } = string.Empty;
    public string ClosureReason { get; private set; } = string.Empty;
    public DateTime? ClosureDate { get; private set; }
    public string ClosedBy { get; private set; } = string.Empty;
    public bool LessonsShared { get; private set; }
    public string LessonsSharingMethod { get; private set; } = string.Empty;
    
    // Navigation Properties
    public virtual ICollection<IncidentInvestigation> Investigations { get; private set; } = new List<IncidentInvestigation>();
    public virtual ICollection<IncidentCAPA> CAPAs { get; private set; } = new List<IncidentCAPA>();
    public virtual ICollection<IncidentNotification> Notifications { get; private set; } = new List<IncidentNotification>();
    
    // Constructor
    protected Incident() { } // EF Core
    
    public Incident(
        DateTime incidentDateTime,
        string title,
        string description,
        IncidentCategory category,
        IncidentType type,
        IncidentSeverity severity,
        IncidentUrgency urgency,
        string location,
        string building,
        string department,
        string reportedBy,
        string reporterEmail,
        PersonType reporterType,
        bool isAnonymous = false)
    {
        IncidentNumber = GenerateIncidentNumber();
        IncidentDateTime = incidentDateTime;
        ReportedDateTime = DateTime.UtcNow;
        Title = title;
        Description = description;
        Category = category;
        Type = type;
        Severity = severity;
        Urgency = urgency;
        Status = IncidentStatus.Open;
        Location = location;
        Building = building;
        Department = department;
        ReportedBy = reportedBy;
        ReporterEmail = reporterEmail;
        ReporterType = reporterType;
        IsAnonymous = isAnonymous;
        InvestigationStatus = InvestigationStatus.NotStarted;
        
        if (isAnonymous)
        {
            AnonymousTrackingCode = GenerateAnonymousTrackingCode();
        }
        
        // Set investigation due date based on severity
        SetInvestigationDueDate();
        
        // Calculate regulatory deadline
        CalculateRegulatoryDeadline();
        
        // Set academic year and term
        SetAcademicPeriod();
    }
    
    // Core Methods
    public void UpdateBasicInfo(string title, string description, IncidentSeverity severity, IncidentUrgency urgency)
    {
        Title = title;
        Description = description;
        Severity = severity;
        Urgency = urgency;
        CalculateRegulatoryDeadline();
        SetInvestigationDueDate();
    }
    
    public void SetLocation(string location, string building, string floor, string room, string specificLocation)
    {
        Location = location;
        Building = building;
        Floor = floor;
        Room = room;
        SpecificLocation = specificLocation;
    }
    
    public void SetGPSLocation(double latitude, double longitude)
    {
        Latitude = latitude;
        Longitude = longitude;
    }
    
    public void SetQRCodeLocation(string qrCode)
    {
        QRCodeLocation = qrCode;
    }
    
    // Person Affected Methods
    public void SetPersonAffected(
        PersonType personType,
        string name,
        string id,
        string department,
        string studentClass = "",
        int? age = null,
        string contact = "")
    {
        PersonAffectedType = personType;
        PersonAffectedName = name;
        PersonAffectedId = id;
        PersonAffectedDepartment = department;
        PersonAffectedClass = studentClass;
        PersonAffectedAge = age;
        PersonAffectedContact = contact;
    }
    
    // Witness Management
    public void AddWitnesses(List<string> witnessNames, List<string> witnessContacts)
    {
        WitnessNames = System.Text.Json.JsonSerializer.Serialize(witnessNames);
        WitnessContacts = System.Text.Json.JsonSerializer.Serialize(witnessContacts);
    }
    
    public void MarkWitnessStatementsCollected()
    {
        WitnessStatementsCollected = true;
    }
    
    // Immediate Response Methods
    public void RecordImmediateActions(string actions)
    {
        ImmediateActions = actions;
    }
    
    public void RecordFirstAid(string firstAidDetails)
    {
        FirstAidProvided = firstAidDetails;
    }
    
    public void NotifyEmergencyServices(string serviceType)
    {
        EmergencyServicesNotified = true;
        EmergencyServiceNotificationTime = DateTime.UtcNow;
        EmergencyServiceType = serviceType;
    }
    
    public void SetMedicalTreatment(bool required, string hospitalName = "", string treatmentDetails = "")
    {
        RequiresMedicalAttention = required;
        HospitalName = hospitalName;
        MedicalTreatmentDetails = treatmentDetails;
    }
    
    // Investigation Methods
    public void StartInvestigation(string investigator)
    {
        InvestigationStatus = InvestigationStatus.InProgress;
        InvestigatedBy = investigator;
        InvestigationStartDate = DateTime.UtcNow;
        Status = IncidentStatus.UnderInvestigation;
    }
    
    public void CompleteInvestigation(
        string rootCause,
        string contributingFactors,
        string lessonsLearned)
    {
        RootCauseAnalysis = rootCause;
        ContributingFactors = contributingFactors;
        LessonsLearned = lessonsLearned;
        InvestigationStatus = InvestigationStatus.Completed;
        InvestigationCompletedDate = DateTime.UtcNow;
        Status = IncidentStatus.AwaitingApproval;
    }
    
    // Parent Communication Methods
    public void SetParentInfo(string parentName, string contact, string email, string preferredLanguage = "en")
    {
        ParentGuardianName = parentName;
        ParentGuardianContact = contact;
        ParentGuardianEmail = email;
        ParentPreferredLanguage = preferredLanguage;
    }
    
    public void NotifyParent(string method)
    {
        ParentNotified = true;
        ParentNotificationTime = DateTime.UtcNow;
        ParentNotificationMethod = method;
    }
    
    public void RecordParentAcknowledgment()
    {
        ParentAcknowledgment = true;
        ParentAcknowledgmentTime = DateTime.UtcNow;
    }
    
    // Insurance and Legal Methods
    public void InitiateInsuranceClaim(string claimNumber, string provider)
    {
        InsuranceClaimInitiated = true;
        InsuranceClaimNumber = claimNumber;
        InsuranceProvider = provider;
    }
    
    public void SetCosts(decimal estimated, decimal actual = 0)
    {
        EstimatedCosts = estimated;
        ActualCosts = actual;
    }
    
    public void InitiateLegalAction(string caseNumber)
    {
        LegalActionRequired = true;
        LegalCaseNumber = caseNumber;
        LegalStatus = "Initiated";
    }
    
    // Indonesian Regulatory Compliance
    public void SetBPJSReporting(bool required)
    {
        RequiresBPJSReporting = required;
    }
    
    public void RecordBPJSReport(string referenceNumber)
    {
        BPJSReferenceNumber = referenceNumber;
        BPJSReportedDate = DateTime.UtcNow;
        CheckRegulatoryCompliance();
    }
    
    public void SetMinistryReporting(bool required)
    {
        RequiresMinistryReporting = required;
    }
    
    public void RecordMinistryReport(string referenceNumber)
    {
        MinistryReferenceNumber = referenceNumber;
        MinistryReportedDate = DateTime.UtcNow;
        CheckRegulatoryCompliance();
    }
    
    public void RecordP2K3Review(string status)
    {
        P2K3ReviewStatus = status;
        P2K3ReviewDate = DateTime.UtcNow;
    }
    
    // School Context Methods
    public void SetSchoolContext(
        string activityType,
        string subjectClass,
        string teacherInCharge,
        string supervisorPresent,
        int studentsPresent)
    {
        ActivityType = activityType;
        SubjectClass = subjectClass;
        TeacherInCharge = teacherInCharge;
        SupervisorPresent = supervisorPresent;
        StudentsPresent = studentsPresent;
    }
    
    public void SetEnvironmentalConditions(string weather, string lighting)
    {
        WeatherConditions = weather;
        LightingConditions = lighting;
    }
    
    // Evidence Methods
    public void AddPhotos(List<string> urls)
    {
        PhotoUrls = System.Text.Json.JsonSerializer.Serialize(urls);
    }
    
    public void AddVideos(List<string> urls)
    {
        VideoUrls = System.Text.Json.JsonSerializer.Serialize(urls);
    }
    
    public void AddDocuments(List<string> urls)
    {
        DocumentUrls = System.Text.Json.JsonSerializer.Serialize(urls);
    }
    
    public void AddCCTVFootage(List<string> urls)
    {
        CCTVFootageUrls = System.Text.Json.JsonSerializer.Serialize(urls);
        EvidenceChainOfCustody = true;
    }
    
    // Closure Methods
    public void ScheduleFollowUp(DateTime followUpDate, string notes)
    {
        FollowUpRequired = true;
        NextFollowUpDate = followUpDate;
        FollowUpNotes = notes;
    }
    
    public void ShareLessons(string method)
    {
        LessonsShared = true;
        LessonsSharingMethod = method;
    }
    
    public void CloseIncident(string reason, string closedBy)
    {
        Status = IncidentStatus.Closed;
        ClosureReason = reason;
        ClosureDate = DateTime.UtcNow;
        ClosedBy = closedBy;
    }
    
    // Helper Methods
    public bool IsStudentIncident()
    {
        return PersonAffectedType == PersonType.Student ||
               Category.ToString().Contains("Student") ||
               !string.IsNullOrEmpty(PersonAffectedClass);
    }
    
    public bool RequiresImmediateParentNotification()
    {
        return IsStudentIncident() &&
               (Severity >= IncidentSeverity.Moderate ||
                Urgency >= IncidentUrgency.High ||
                RequiresMedicalAttention ||
                Category.ToString().Contains("Behavioral") ||
                Category.ToString().Contains("Bullying"));
    }
    
    public bool IsOverdue()
    {
        return InvestigationDueDate.HasValue && 
               DateTime.UtcNow > InvestigationDueDate.Value &&
               InvestigationStatus != InvestigationStatus.Completed;
    }
    
    public bool IsRegulatoryDeadlinePending()
    {
        return RegulatoryDeadline.HasValue &&
               DateTime.UtcNow > RegulatoryDeadline.Value &&
               !RegulatoryDeadlineMet;
    }
    
    // Private Helper Methods
    private void SetInvestigationDueDate()
    {
        InvestigationDueDate = Urgency switch
        {
            IncidentUrgency.Emergency => IncidentDateTime.AddHours(4),
            IncidentUrgency.Critical => IncidentDateTime.AddHours(24),
            IncidentUrgency.High => IncidentDateTime.AddDays(3),
            IncidentUrgency.Medium => IncidentDateTime.AddDays(7),
            IncidentUrgency.Low => IncidentDateTime.AddDays(14),
            _ => IncidentDateTime.AddDays(14)
        };
    }
    
    private void CalculateRegulatoryDeadline()
    {
        RegulatoryDeadline = Severity switch
        {
            IncidentSeverity.Critical => IncidentDateTime.AddHours(24),
            IncidentSeverity.Major => IncidentDateTime.AddDays(2),
            IncidentSeverity.Moderate => IncidentDateTime.AddDays(7),
            IncidentSeverity.Low => IncidentDateTime.AddDays(14),
            IncidentSeverity.Minor => IncidentDateTime.AddDays(30),
            _ => IncidentDateTime.AddDays(30)
        };
    }
    
    private void CheckRegulatoryCompliance()
    {
        if (RegulatoryDeadline.HasValue)
        {
            var reportingComplete = (!RequiresBPJSReporting || BPJSReportedDate.HasValue) &&
                                   (!RequiresMinistryReporting || MinistryReportedDate.HasValue);
                                   
            RegulatoryDeadlineMet = reportingComplete && DateTime.UtcNow <= RegulatoryDeadline.Value;
        }
    }
    
    private void SetAcademicPeriod()
    {
        var now = DateTime.Now;
        AcademicYear = now.Month >= 8 ? $"{now.Year}/{now.Year + 1}" : $"{now.Year - 1}/{now.Year}";
        
        Term = now.Month switch
        {
            >= 8 and <= 12 => "Term 1",
            >= 1 and <= 3 => "Term 2",
            >= 4 and <= 7 => "Term 3",
            _ => "Holiday"
        };
    }
    
    private static string GenerateIncidentNumber()
    {
        var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
        var random = new Random().Next(1000, 9999);
        return $"BSJ-INC-{timestamp}-{random}";
    }
    
    private static string GenerateAnonymousTrackingCode()
    {
        var random = new Random();
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return new string(Enumerable.Repeat(chars, 8)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }
    
    // Evidence Helper Methods
    public List<string> GetPhotos()
    {
        return string.IsNullOrEmpty(PhotoUrls)
            ? new List<string>()
            : System.Text.Json.JsonSerializer.Deserialize<List<string>>(PhotoUrls) ?? new List<string>();
    }
    
    public List<string> GetVideos()
    {
        return string.IsNullOrEmpty(VideoUrls)
            ? new List<string>()
            : System.Text.Json.JsonSerializer.Deserialize<List<string>>(VideoUrls) ?? new List<string>();
    }
    
    public List<string> GetDocuments()
    {
        return string.IsNullOrEmpty(DocumentUrls)
            ? new List<string>()
            : System.Text.Json.JsonSerializer.Deserialize<List<string>>(DocumentUrls) ?? new List<string>();
    }
    
    public List<string> GetWitnessNames()
    {
        return string.IsNullOrEmpty(WitnessNames)
            ? new List<string>()
            : System.Text.Json.JsonSerializer.Deserialize<List<string>>(WitnessNames) ?? new List<string>();
    }
    
    public List<string> GetWitnessContacts()
    {
        return string.IsNullOrEmpty(WitnessContacts)
            ? new List<string>()
            : System.Text.Json.JsonSerializer.Deserialize<List<string>>(WitnessContacts) ?? new List<string>();
    }
}