namespace DigitalHSE.Domain.HSE.Enums;

public enum InvestigationStatus
{
    NotStarted = 1,
    InProgress = 2,
    PendingReview = 3,
    UnderReview = 4,
    RequiresMoreInfo = 5,
    Completed = 6,
    Closed = 7
}