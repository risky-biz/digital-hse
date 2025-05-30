using Microsoft.EntityFrameworkCore;
using DigitalHSE.Domain.HSE.Entities;
using DigitalHSE.Domain.Auth;

namespace DigitalHSE.Infrastructure;

public class DigitalHSEDBContext : DbContext
{
    public DigitalHSEDBContext(DbContextOptions<DigitalHSEDBContext> options) : base(options)
    {
    }

    // Auth Entities
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Permission> Permissions { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<RolePermission> RolePermissions { get; set; }

    // HSE Entities
    public DbSet<Incident> Incidents { get; set; }
    public DbSet<RiskAssessment> RiskAssessments { get; set; }
    public DbSet<Permit> Permits { get; set; }
    public DbSet<ComplianceItem> ComplianceItems { get; set; }
    public DbSet<TrainingRecord> TrainingRecords { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Create HSE schema
        modelBuilder.HasDefaultSchema("public");
        
        // Apply all configurations from assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(DigitalHSEDBContext).Assembly);
    }
}
