using DigitalHSE.Domain.Common;

namespace DigitalHSE.Domain.Auth;

public class User : TrackableEntity
{
    public string Username { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public string EmployeeId { get; private set; } = string.Empty;
    public string Department { get; private set; } = string.Empty;
    public string Position { get; private set; } = string.Empty;
    public string PhoneNumber { get; private set; } = string.Empty;
    public string PreferredLanguage { get; private set; } = "en";
    public bool IsActive { get; private set; } = true;
    public bool IsEmailConfirmed { get; private set; } = false;
    public DateTime? LastLoginDate { get; private set; }
    public string? RefreshToken { get; private set; }
    public DateTime? RefreshTokenExpiryTime { get; private set; }
    public int FailedLoginAttempts { get; private set; } = 0;
    public DateTime? LockoutEndDate { get; private set; }

    // Navigation properties
    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();

    // Private constructor for EF Core
    private User() { }

    public User(string username, string email, string passwordHash, string firstName, string lastName, 
                string employeeId, string department, string position, string phoneNumber = "", string preferredLanguage = "en")
    {
        Username = username;
        Email = email;
        PasswordHash = passwordHash;
        FirstName = firstName;
        LastName = lastName;
        EmployeeId = employeeId;
        Department = department;
        Position = position;
        PhoneNumber = phoneNumber;
        PreferredLanguage = preferredLanguage;
        IsActive = true;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    // Business methods
    public void UpdateProfile(string firstName, string lastName, string phoneNumber, string preferredLanguage)
    {
        FirstName = firstName;
        LastName = lastName;
        PhoneNumber = phoneNumber;
        PreferredLanguage = preferredLanguage;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ChangePassword(string newPasswordHash)
    {
        PasswordHash = newPasswordHash;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateLastLogin()
    {
        LastLoginDate = DateTime.UtcNow;
        FailedLoginAttempts = 0;
        LockoutEndDate = null;
        UpdatedAt = DateTime.UtcNow;
    }

    public void RecordFailedLogin()
    {
        FailedLoginAttempts++;
        if (FailedLoginAttempts >= 5)
        {
            LockoutEndDate = DateTime.UtcNow.AddMinutes(30); // Lock for 30 minutes
        }
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetRefreshToken(string refreshToken, DateTime expiryTime)
    {
        RefreshToken = refreshToken;
        RefreshTokenExpiryTime = expiryTime;
        UpdatedAt = DateTime.UtcNow;
    }

    public void RevokeRefreshToken()
    {
        RefreshToken = null;
        RefreshTokenExpiryTime = null;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ActivateUser()
    {
        IsActive = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void DeactivateUser()
    {
        IsActive = false;
        RevokeRefreshToken();
        UpdatedAt = DateTime.UtcNow;
    }

    public void ConfirmEmail()
    {
        IsEmailConfirmed = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public bool IsLockedOut()
    {
        return LockoutEndDate.HasValue && LockoutEndDate.Value > DateTime.UtcNow;
    }

    public string GetFullName()
    {
        return $"{FirstName} {LastName}".Trim();
    }

    public bool CanLogin()
    {
        return IsActive && !IsLockedOut();
    }
}