using DigitalHSE.Domain.Common;

namespace DigitalHSE.Domain.HSE.Entities;

public class IncidentNotification : TrackableEntity
{
    public int IncidentId { get; private set; }
    public virtual Incident Incident { get; private set; } = null!;
    
    // Notification Details
    public string NotificationType { get; private set; } = string.Empty; // Email, SMS, WhatsApp, Push
    public string RecipientRole { get; private set; } = string.Empty; // Parent, Principal, HSE Manager, etc.
    public string RecipientName { get; private set; } = string.Empty;
    public string RecipientContact { get; private set; } = string.Empty; // Email or phone number
    public NotificationPriority Priority { get; private set; }
    public NotificationStatus Status { get; private set; }
    
    // Content
    public string Subject { get; private set; } = string.Empty;
    public string Message { get; private set; } = string.Empty;
    public string Language { get; private set; } = "en"; // en, id (Bahasa Indonesia)
    
    // Timing
    public DateTime ScheduledTime { get; private set; }
    public DateTime? SentTime { get; private set; }
    public DateTime? DeliveredTime { get; private set; }
    public DateTime? ReadTime { get; private set; }
    
    // Retry Logic
    public int RetryCount { get; private set; }
    public int MaxRetries { get; private set; } = 3;
    public string ErrorMessage { get; private set; } = string.Empty;
    
    // Compliance Tracking (for regulatory notifications)
    public bool IsRegulatoryRequired { get; private set; }
    public string RegulatoryBody { get; private set; } = string.Empty; // Disnaker, Ministry of Education
    public DateTime? RegulatoryDeadline { get; private set; }
    
    protected IncidentNotification() { } // EF Core
    
    public IncidentNotification(
        int incidentId,
        string notificationType,
        string recipientRole,
        string recipientName,
        string recipientContact,
        NotificationPriority priority,
        string subject,
        string message,
        string language = "en")
    {
        IncidentId = incidentId;
        NotificationType = notificationType;
        RecipientRole = recipientRole;
        RecipientName = recipientName;
        RecipientContact = recipientContact;
        Priority = priority;
        Subject = subject;
        Message = message;
        Language = language;
        Status = NotificationStatus.Pending;
        ScheduledTime = CalculateScheduledTime(priority);
    }
    
    public void MarkAsSent()
    {
        Status = NotificationStatus.Sent;
        SentTime = DateTime.UtcNow;
    }
    
    public void MarkAsDelivered()
    {
        Status = NotificationStatus.Delivered;
        DeliveredTime = DateTime.UtcNow;
    }
    
    public void MarkAsRead()
    {
        Status = NotificationStatus.Read;
        ReadTime = DateTime.UtcNow;
    }
    
    public void MarkAsFailed(string errorMessage)
    {
        Status = NotificationStatus.Failed;
        ErrorMessage = errorMessage;
        RetryCount++;
        
        if (RetryCount < MaxRetries)
        {
            Status = NotificationStatus.PendingRetry;
            ScheduledTime = DateTime.UtcNow.AddMinutes(RetryCount * 5); // Exponential backoff
        }
    }
    
    public void SetRegulatoryRequirement(string regulatoryBody, DateTime deadline)
    {
        IsRegulatoryRequired = true;
        RegulatoryBody = regulatoryBody;
        RegulatoryDeadline = deadline;
        
        // High priority for regulatory notifications
        if (Priority < NotificationPriority.High)
        {
            Priority = NotificationPriority.High;
            ScheduledTime = CalculateScheduledTime(Priority);
        }
    }
    
    public bool IsOverdue()
    {
        return DateTime.UtcNow > ScheduledTime && Status == NotificationStatus.Pending;
    }
    
    public bool IsRegulatoryOverdue()
    {
        return IsRegulatoryRequired && 
               RegulatoryDeadline.HasValue && 
               DateTime.UtcNow > RegulatoryDeadline.Value && 
               Status != NotificationStatus.Delivered;
    }
    
    private DateTime CalculateScheduledTime(NotificationPriority priority)
    {
        // Based on BSJ requirements - notification timelines
        return priority switch
        {
            NotificationPriority.Critical => DateTime.UtcNow.AddMinutes(15),    // Life-threatening: 15 min
            NotificationPriority.High => DateTime.UtcNow.AddHours(1),          // Serious: 1 hour
            NotificationPriority.Medium => DateTime.UtcNow.AddHours(4),        // Behavioral: 4 hours
            NotificationPriority.Low => DateTime.UtcNow.AddHours(24),          // Minor: 24 hours
            _ => DateTime.UtcNow.AddHours(1)
        };
    }
}

public enum NotificationPriority
{
    Low = 1,        // Minor incidents: 24-48 hours
    Medium = 2,     // Behavioral incidents: Same day
    High = 3,       // Serious injuries: 2-4 hours
    Critical = 4    // Life-threatening: Within 1 hour
}

public enum NotificationStatus
{
    Pending = 1,
    Sent = 2,
    Delivered = 3,
    Read = 4,
    Failed = 5,
    PendingRetry = 6,
    Cancelled = 7
}