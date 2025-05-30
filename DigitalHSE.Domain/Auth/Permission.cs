using DigitalHSE.Domain.Common;

namespace DigitalHSE.Domain.Auth;

public class Permission : Entity
{
    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public string Module { get; private set; } = string.Empty; // e.g., "Incidents", "Reports", "Users"
    public string Action { get; private set; } = string.Empty; // e.g., "Create", "Read", "Update", "Delete"

    // Navigation properties
    public virtual ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();

    // Private constructor for EF Core
    private Permission() { }

    public Permission(string name, string description, string module, string action)
    {
        Name = name;
        Description = description;
        Module = module;
        Action = action;
    }

    public void UpdatePermission(string name, string description, string module, string action)
    {
        Name = name;
        Description = description;
        Module = module;
        Action = action;
    }
}

// Predefined permissions for HSE system
public static class HSEPermissions
{
    // Incident Management
    public const string INCIDENTS_VIEW = "incidents.view";
    public const string INCIDENTS_CREATE = "incidents.create";
    public const string INCIDENTS_UPDATE = "incidents.update";
    public const string INCIDENTS_DELETE = "incidents.delete";
    public const string INCIDENTS_INVESTIGATE = "incidents.investigate";
    public const string INCIDENTS_APPROVE = "incidents.approve";
    public const string INCIDENTS_REPORT = "incidents.report";

    // Risk Assessment
    public const string RISKS_VIEW = "risks.view";
    public const string RISKS_CREATE = "risks.create";
    public const string RISKS_UPDATE = "risks.update";
    public const string RISKS_DELETE = "risks.delete";
    public const string RISKS_APPROVE = "risks.approve";
    public const string RISKS_REVIEW = "risks.review";

    // Permits
    public const string PERMITS_VIEW = "permits.view";
    public const string PERMITS_CREATE = "permits.create";
    public const string PERMITS_UPDATE = "permits.update";
    public const string PERMITS_DELETE = "permits.delete";
    public const string PERMITS_APPROVE = "permits.approve";
    public const string PERMITS_ISSUE = "permits.issue";

    // Training Records
    public const string TRAINING_VIEW = "training.view";
    public const string TRAINING_CREATE = "training.create";
    public const string TRAINING_UPDATE = "training.update";
    public const string TRAINING_DELETE = "training.delete";
    public const string TRAINING_APPROVE = "training.approve";

    // Compliance
    public const string COMPLIANCE_VIEW = "compliance.view";
    public const string COMPLIANCE_CREATE = "compliance.create";
    public const string COMPLIANCE_UPDATE = "compliance.update";
    public const string COMPLIANCE_DELETE = "compliance.delete";

    // Reports & Analytics
    public const string REPORTS_VIEW = "reports.view";
    public const string REPORTS_CREATE = "reports.create";
    public const string ANALYTICS_VIEW = "analytics.view";
    public const string DASHBOARD_VIEW = "dashboard.view";

    // User Management
    public const string USERS_VIEW = "users.view";
    public const string USERS_CREATE = "users.create";
    public const string USERS_UPDATE = "users.update";
    public const string USERS_DELETE = "users.delete";
    public const string USERS_MANAGE_ROLES = "users.manage_roles";

    // System Administration
    public const string SYSTEM_SETTINGS = "system.settings";
    public const string SYSTEM_AUDIT = "system.audit";
    public const string SYSTEM_BACKUP = "system.backup";
}