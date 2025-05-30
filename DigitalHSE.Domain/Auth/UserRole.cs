using DigitalHSE.Domain.Common;

namespace DigitalHSE.Domain.Auth;

public class UserRole : Entity
{
    public int UserId { get; private set; }
    public int RoleId { get; private set; }
    public DateTime AssignedDate { get; private set; }
    public DateTime? ExpiryDate { get; private set; }
    public bool IsActive { get; private set; } = true;

    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual Role Role { get; set; } = null!;

    // Private constructor for EF Core
    private UserRole() { }

    public UserRole(int userId, int roleId, DateTime? expiryDate = null)
    {
        UserId = userId;
        RoleId = roleId;
        AssignedDate = DateTime.UtcNow;
        ExpiryDate = expiryDate;
        IsActive = true;
    }

    public void Activate()
    {
        IsActive = true;
    }

    public void Deactivate()
    {
        IsActive = false;
    }

    public void ExtendExpiry(DateTime newExpiryDate)
    {
        ExpiryDate = newExpiryDate;
    }

    public bool IsExpired()
    {
        return ExpiryDate.HasValue && ExpiryDate.Value < DateTime.UtcNow;
    }

    public bool IsValid()
    {
        return IsActive && !IsExpired();
    }
}