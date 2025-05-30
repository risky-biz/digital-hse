using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DigitalHSE.Domain.Auth;

namespace DigitalHSE.Infrastructure.EntityConfigurations.Auth;

public class PermissionConfiguration : IEntityTypeConfiguration<Permission>
{
    public void Configure(EntityTypeBuilder<Permission> builder)
    {
        builder.ToTable("Permissions");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(p => p.Description)
            .HasMaxLength(500);

        builder.Property(p => p.Module)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(p => p.Action)
            .IsRequired()
            .HasMaxLength(50);

        // Indexes
        builder.HasIndex(p => p.Name)
            .IsUnique();

        builder.HasIndex(p => new { p.Module, p.Action });

        // Relationships
        builder.HasMany(p => p.RolePermissions)
            .WithOne(rp => rp.Permission)
            .HasForeignKey(rp => rp.PermissionId)
            .OnDelete(DeleteBehavior.Cascade);

        // Seed HSE permissions
        var permissions = new List<object>();
        var id = 1;

        // Incident Management Permissions
        permissions.AddRange(new[]
        {
            new { Id = id++, Name = HSEPermissions.INCIDENTS_VIEW, Description = "View incidents", Module = "Incidents", Action = "View" },
            new { Id = id++, Name = HSEPermissions.INCIDENTS_CREATE, Description = "Create new incidents", Module = "Incidents", Action = "Create" },
            new { Id = id++, Name = HSEPermissions.INCIDENTS_UPDATE, Description = "Update existing incidents", Module = "Incidents", Action = "Update" },
            new { Id = id++, Name = HSEPermissions.INCIDENTS_DELETE, Description = "Delete incidents", Module = "Incidents", Action = "Delete" },
            new { Id = id++, Name = HSEPermissions.INCIDENTS_INVESTIGATE, Description = "Investigate incidents", Module = "Incidents", Action = "Investigate" },
            new { Id = id++, Name = HSEPermissions.INCIDENTS_APPROVE, Description = "Approve incident reports", Module = "Incidents", Action = "Approve" },
            new { Id = id++, Name = HSEPermissions.INCIDENTS_REPORT, Description = "Generate incident reports", Module = "Incidents", Action = "Report" }
        });

        // Risk Assessment Permissions
        permissions.AddRange(new[]
        {
            new { Id = id++, Name = HSEPermissions.RISKS_VIEW, Description = "View risk assessments", Module = "Risks", Action = "View" },
            new { Id = id++, Name = HSEPermissions.RISKS_CREATE, Description = "Create new risk assessments", Module = "Risks", Action = "Create" },
            new { Id = id++, Name = HSEPermissions.RISKS_UPDATE, Description = "Update existing risk assessments", Module = "Risks", Action = "Update" },
            new { Id = id++, Name = HSEPermissions.RISKS_DELETE, Description = "Delete risk assessments", Module = "Risks", Action = "Delete" },
            new { Id = id++, Name = HSEPermissions.RISKS_APPROVE, Description = "Approve risk assessments", Module = "Risks", Action = "Approve" },
            new { Id = id++, Name = HSEPermissions.RISKS_REVIEW, Description = "Review risk assessments", Module = "Risks", Action = "Review" }
        });

        // Permit Permissions
        permissions.AddRange(new[]
        {
            new { Id = id++, Name = HSEPermissions.PERMITS_VIEW, Description = "View permits", Module = "Permits", Action = "View" },
            new { Id = id++, Name = HSEPermissions.PERMITS_CREATE, Description = "Create new permits", Module = "Permits", Action = "Create" },
            new { Id = id++, Name = HSEPermissions.PERMITS_UPDATE, Description = "Update existing permits", Module = "Permits", Action = "Update" },
            new { Id = id++, Name = HSEPermissions.PERMITS_DELETE, Description = "Delete permits", Module = "Permits", Action = "Delete" },
            new { Id = id++, Name = HSEPermissions.PERMITS_APPROVE, Description = "Approve permits", Module = "Permits", Action = "Approve" },
            new { Id = id++, Name = HSEPermissions.PERMITS_ISSUE, Description = "Issue permits", Module = "Permits", Action = "Issue" }
        });

        // Training Permissions
        permissions.AddRange(new[]
        {
            new { Id = id++, Name = HSEPermissions.TRAINING_VIEW, Description = "View training records", Module = "Training", Action = "View" },
            new { Id = id++, Name = HSEPermissions.TRAINING_CREATE, Description = "Create new training records", Module = "Training", Action = "Create" },
            new { Id = id++, Name = HSEPermissions.TRAINING_UPDATE, Description = "Update existing training records", Module = "Training", Action = "Update" },
            new { Id = id++, Name = HSEPermissions.TRAINING_DELETE, Description = "Delete training records", Module = "Training", Action = "Delete" },
            new { Id = id++, Name = HSEPermissions.TRAINING_APPROVE, Description = "Approve training records", Module = "Training", Action = "Approve" }
        });

        // Compliance Permissions
        permissions.AddRange(new[]
        {
            new { Id = id++, Name = HSEPermissions.COMPLIANCE_VIEW, Description = "View compliance items", Module = "Compliance", Action = "View" },
            new { Id = id++, Name = HSEPermissions.COMPLIANCE_CREATE, Description = "Create new compliance items", Module = "Compliance", Action = "Create" },
            new { Id = id++, Name = HSEPermissions.COMPLIANCE_UPDATE, Description = "Update existing compliance items", Module = "Compliance", Action = "Update" },
            new { Id = id++, Name = HSEPermissions.COMPLIANCE_DELETE, Description = "Delete compliance items", Module = "Compliance", Action = "Delete" }
        });

        // Reports & Analytics Permissions
        permissions.AddRange(new[]
        {
            new { Id = id++, Name = HSEPermissions.REPORTS_VIEW, Description = "View reports", Module = "Reports", Action = "View" },
            new { Id = id++, Name = HSEPermissions.REPORTS_CREATE, Description = "Create new reports", Module = "Reports", Action = "Create" },
            new { Id = id++, Name = HSEPermissions.ANALYTICS_VIEW, Description = "View analytics", Module = "Analytics", Action = "View" },
            new { Id = id++, Name = HSEPermissions.DASHBOARD_VIEW, Description = "View dashboard", Module = "Dashboard", Action = "View" }
        });

        // User Management Permissions
        permissions.AddRange(new[]
        {
            new { Id = id++, Name = HSEPermissions.USERS_VIEW, Description = "View users", Module = "Users", Action = "View" },
            new { Id = id++, Name = HSEPermissions.USERS_CREATE, Description = "Create new users", Module = "Users", Action = "Create" },
            new { Id = id++, Name = HSEPermissions.USERS_UPDATE, Description = "Update existing users", Module = "Users", Action = "Update" },
            new { Id = id++, Name = HSEPermissions.USERS_DELETE, Description = "Delete users", Module = "Users", Action = "Delete" },
            new { Id = id++, Name = HSEPermissions.USERS_MANAGE_ROLES, Description = "Manage user roles", Module = "Users", Action = "ManageRoles" }
        });

        // System Administration Permissions
        permissions.AddRange(new[]
        {
            new { Id = id++, Name = HSEPermissions.SYSTEM_SETTINGS, Description = "Manage system settings", Module = "System", Action = "Settings" },
            new { Id = id++, Name = HSEPermissions.SYSTEM_AUDIT, Description = "View system audit logs", Module = "System", Action = "Audit" },
            new { Id = id++, Name = HSEPermissions.SYSTEM_BACKUP, Description = "Manage system backups", Module = "System", Action = "Backup" }
        });

        builder.HasData(permissions.ToArray());
    }
}