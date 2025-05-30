using DigitalHSE.Application.Common;

namespace DigitalHSE.Application.Features.Incidents.Commands.NotifyParent;

public record NotifyParentCommand : ICommandQuery<bool>
{
    public int IncidentId { get; init; }
    public string NotificationMethod { get; init; } = string.Empty; // SMS, Email, Phone, WhatsApp
    public string MessageTemplate { get; init; } = string.Empty;
    public string Language { get; init; } = "en";
    public bool IsUrgent { get; init; }
    public string SentBy { get; init; } = string.Empty;
    public string AdditionalNotes { get; init; } = string.Empty;
}