using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DigitalHSE.Domain.Auth;

namespace DigitalHSE.Infrastructure.EntityConfigurations.Auth;

public class RolePermissionConfiguration : IEntityTypeConfiguration<RolePermission>
{
    public void Configure(EntityTypeBuilder<RolePermission> builder)
    {
        builder.ToTable("RolePermissions");

        builder.HasKey(rp => rp.Id);

        builder.Property(rp => rp.GrantedDate)
            .IsRequired();

        builder.Property(rp => rp.IsActive)
            .HasDefaultValue(true);

        // Indexes
        builder.HasIndex(rp => new { rp.RoleId, rp.PermissionId })
            .IsUnique();

        // Relationships
        builder.HasOne(rp => rp.Role)
            .WithMany(r => r.RolePermissions)
            .HasForeignKey(rp => rp.RoleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(rp => rp.Permission)
            .WithMany(p => p.RolePermissions)
            .HasForeignKey(rp => rp.PermissionId)
            .OnDelete(DeleteBehavior.Cascade);

        // Seed role permissions based on school roles
        var rolePermissions = new List<object>();
        var id = 1;

        // System Administrator - All permissions (1-37)
        for (int permissionId = 1; permissionId <= 37; permissionId++)
        {
            rolePermissions.Add(new
            {
                Id = id++,
                RoleId = 1, // System Administrator
                PermissionId = permissionId,
                GrantedDate = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                IsActive = true
            });
        }

        // HSE Manager - All HSE permissions (1-32)
        for (int permissionId = 1; permissionId <= 32; permissionId++)
        {
            rolePermissions.Add(new
            {
                Id = id++,
                RoleId = 2, // HSE Manager
                PermissionId = permissionId,
                GrantedDate = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                IsActive = true
            });
        }

        // HSE Officer - Operational HSE permissions (view, create, update)
        var hseOfficerPermissions = new[] { 1, 2, 3, 5, 8, 9, 10, 14, 15, 16, 17, 20, 21, 22, 24, 25, 26, 27, 28, 29, 30, 31, 32 };
        foreach (var permissionId in hseOfficerPermissions)
        {
            rolePermissions.Add(new
            {
                Id = id++,
                RoleId = 3, // HSE Officer
                PermissionId = permissionId,
                GrantedDate = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                IsActive = true
            });
        }

        // Teacher - Basic incident reporting and view permissions
        var teacherPermissions = new[] { 1, 2, 8, 15, 25, 29, 32 }; // View incidents, create incidents, view risks, view training, view compliance, view reports, view dashboard
        foreach (var permissionId in teacherPermissions)
        {
            rolePermissions.Add(new
            {
                Id = id++,
                RoleId = 4, // Teacher
                PermissionId = permissionId,
                GrantedDate = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                IsActive = true
            });
        }

        // Student - Very limited permissions
        var studentPermissions = new[] { 1, 2, 32 }; // View incidents, create incidents (report), view dashboard
        foreach (var permissionId in studentPermissions)
        {
            rolePermissions.Add(new
            {
                Id = id++,
                RoleId = 5, // Student
                PermissionId = permissionId,
                GrantedDate = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                IsActive = true
            });
        }

        builder.HasData(rolePermissions.ToArray());
    }
}