using DigitalHSE.Domain.Common;
using DigitalHSE.Domain.HSE.Entities;

namespace DigitalHSE.Domain.Interfaces.HSE;

public interface IIncidentNotificationRepository : IRepository<IncidentNotification>
{
    Task<IEnumerable<IncidentNotification>> GetByIncidentIdAsync(int incidentId);
    Task<IEnumerable<IncidentNotification>> GetPendingNotificationsAsync();
    Task<IEnumerable<IncidentNotification>> GetOverdueNotificationsAsync();
    Task<IEnumerable<IncidentNotification>> GetByRecipientAsync(string recipientContact);
    Task<IEnumerable<IncidentNotification>> GetRegulatoryNotificationsAsync();
}