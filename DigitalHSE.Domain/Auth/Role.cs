using DigitalHSE.Domain.Common;

namespace DigitalHSE.Domain.Auth;

public class Role : TrackableEntity
{
    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public bool IsSystemRole { get; private set; } = false;
    public bool IsActive { get; private set; } = true;

    // Navigation properties
    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public virtual ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();

    // Private constructor for EF Core
    private Role() { }

    public Role(string name, string description, bool isSystemRole = false)
    {
        Name = name;
        Description = description;
        IsSystemRole = isSystemRole;
        IsActive = true;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateRole(string name, string description)
    {
        if (!IsSystemRole) // System roles cannot be modified
        {
            Name = name;
            Description = description;
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public void Activate()
    {
        IsActive = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        if (!IsSystemRole) // System roles cannot be deactivated
        {
            IsActive = false;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}