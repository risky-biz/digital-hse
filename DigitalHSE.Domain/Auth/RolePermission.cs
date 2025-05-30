using DigitalHSE.Domain.Common;

namespace DigitalHSE.Domain.Auth;

public class RolePermission : Entity
{
    public int RoleId { get; private set; }
    public int PermissionId { get; private set; }
    public DateTime GrantedDate { get; private set; }
    public bool IsActive { get; private set; } = true;

    // Navigation properties
    public virtual Role Role { get; set; } = null!;
    public virtual Permission Permission { get; set; } = null!;

    // Private constructor for EF Core
    private RolePermission() { }

    public RolePermission(int roleId, int permissionId)
    {
        RoleId = roleId;
        PermissionId = permissionId;
        GrantedDate = DateTime.UtcNow;
        IsActive = true;
    }

    public void Activate()
    {
        IsActive = true;
    }

    public void Revoke()
    {
        IsActive = false;
    }
}