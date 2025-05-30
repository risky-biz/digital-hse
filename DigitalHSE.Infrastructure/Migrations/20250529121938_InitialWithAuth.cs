using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DigitalHSE.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialWithAuth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "public");

            migrationBuilder.CreateTable(
                name: "ComplianceItems",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ComplianceCode = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Category = table.Column<string>(type: "text", nullable: false),
                    RegulatoryBody = table.Column<string>(type: "text", nullable: false),
                    Regulation = table.Column<string>(type: "text", nullable: false),
                    RegulationSection = table.Column<string>(type: "text", nullable: false),
                    RequirementDetails = table.Column<string>(type: "text", nullable: false),
                    EffectiveDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ComplianceFrequency = table.Column<string>(type: "text", nullable: false),
                    NextDueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastCompletedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    ResponsibleDepartment = table.Column<string>(type: "text", nullable: false),
                    ResponsiblePerson = table.Column<string>(type: "text", nullable: false),
                    ResponsibleEmail = table.Column<string>(type: "text", nullable: false),
                    EvidenceRequired = table.Column<string>(type: "text", nullable: false),
                    EvidenceProvided = table.Column<string>(type: "text", nullable: false),
                    DocumentUrls = table.Column<string>(type: "text", nullable: false),
                    LastAuditDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastAuditResult = table.Column<string>(type: "text", nullable: false),
                    IsIndonesianRegulation = table.Column<bool>(type: "boolean", nullable: false),
                    IndonesianRegulationName = table.Column<string>(type: "text", nullable: false),
                    MinistryDepartment = table.Column<string>(type: "text", nullable: false),
                    RequiresBPJSCompliance = table.Column<bool>(type: "boolean", nullable: false),
                    RequiresGovernmentReporting = table.Column<bool>(type: "boolean", nullable: false),
                    GovernmentReportingFrequency = table.Column<string>(type: "text", nullable: false),
                    IsInViolation = table.Column<bool>(type: "boolean", nullable: false),
                    ViolationDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ViolationDetails = table.Column<string>(type: "text", nullable: false),
                    CorrectiveActions = table.Column<string>(type: "text", nullable: false),
                    CorrectiveActionDeadline = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    UpdatedBy = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComplianceItems", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Incidents",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IncidentNumber = table.Column<string>(type: "text", nullable: false),
                    IncidentDateTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ReportedDateTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Severity = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Location = table.Column<string>(type: "text", nullable: false),
                    Department = table.Column<string>(type: "text", nullable: false),
                    SpecificLocation = table.Column<string>(type: "text", nullable: false),
                    ReportedBy = table.Column<string>(type: "text", nullable: false),
                    ReporterEmail = table.Column<string>(type: "text", nullable: false),
                    ReporterPhone = table.Column<string>(type: "text", nullable: false),
                    Witnesses = table.Column<string>(type: "text", nullable: false),
                    ImmediateActions = table.Column<string>(type: "text", nullable: false),
                    RootCause = table.Column<string>(type: "text", nullable: false),
                    CorrectiveActions = table.Column<string>(type: "text", nullable: false),
                    PreventiveActions = table.Column<string>(type: "text", nullable: false),
                    InvestigationCompletedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    InvestigatedBy = table.Column<string>(type: "text", nullable: false),
                    RequiresBPJSReporting = table.Column<bool>(type: "boolean", nullable: false),
                    BPJSReferenceNumber = table.Column<string>(type: "text", nullable: true),
                    BPJSReportedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    RequiresMinistryReporting = table.Column<bool>(type: "boolean", nullable: false),
                    MinistryReferenceNumber = table.Column<string>(type: "text", nullable: true),
                    MinistryReportedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    RegulatoryDeadline = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AttachmentUrls = table.Column<string>(type: "text", nullable: false),
                    PhotoUrls = table.Column<string>(type: "text", nullable: false),
                    StudentId = table.Column<string>(type: "text", nullable: false),
                    StudentName = table.Column<string>(type: "text", nullable: false),
                    StudentClass = table.Column<string>(type: "text", nullable: false),
                    ParentContact = table.Column<string>(type: "text", nullable: false),
                    ParentNotified = table.Column<bool>(type: "boolean", nullable: false),
                    ParentNotificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    TeacherInCharge = table.Column<string>(type: "text", nullable: false),
                    RequiresMedicalAttention = table.Column<bool>(type: "boolean", nullable: false),
                    MedicalFacility = table.Column<string>(type: "text", nullable: false),
                    AgeGroup = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    UpdatedBy = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Incidents", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Permissions",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Module = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Action = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permissions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Permits",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PermitNumber = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    WorkLocation = table.Column<string>(type: "text", nullable: false),
                    Department = table.Column<string>(type: "text", nullable: false),
                    Equipment = table.Column<string>(type: "text", nullable: false),
                    WorkScope = table.Column<string>(type: "text", nullable: false),
                    EstimatedWorkers = table.Column<int>(type: "integer", nullable: false),
                    RequestedStartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RequestedEndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ActualStartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ActualEndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    RequestedBy = table.Column<string>(type: "text", nullable: false),
                    RequestorEmail = table.Column<string>(type: "text", nullable: false),
                    RequestorPhone = table.Column<string>(type: "text", nullable: false),
                    Supervisor = table.Column<string>(type: "text", nullable: false),
                    SupervisorPhone = table.Column<string>(type: "text", nullable: false),
                    Contractor = table.Column<string>(type: "text", nullable: false),
                    Hazards = table.Column<string>(type: "text", nullable: false),
                    ControlMeasures = table.Column<string>(type: "text", nullable: false),
                    RequiredPPE = table.Column<string>(type: "text", nullable: false),
                    EmergencyProcedures = table.Column<string>(type: "text", nullable: false),
                    RequiresIsolation = table.Column<bool>(type: "boolean", nullable: false),
                    IsolationDetails = table.Column<string>(type: "text", nullable: false),
                    PreparedBy = table.Column<string>(type: "text", nullable: false),
                    PreparedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ReviewedBy = table.Column<string>(type: "text", nullable: false),
                    ReviewedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ApprovedBy = table.Column<string>(type: "text", nullable: false),
                    ApprovedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ApprovalComments = table.Column<string>(type: "text", nullable: false),
                    ClosedBy = table.Column<string>(type: "text", nullable: false),
                    ClosedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ClosureComments = table.Column<string>(type: "text", nullable: false),
                    WorkCompleted = table.Column<bool>(type: "boolean", nullable: false),
                    RequiresSIKB = table.Column<bool>(type: "boolean", nullable: false),
                    SIKBNumber = table.Column<string>(type: "text", nullable: false),
                    RequiresK3Approval = table.Column<bool>(type: "boolean", nullable: false),
                    K3ApprovalNumber = table.Column<string>(type: "text", nullable: false),
                    RiskAssessmentId = table.Column<int>(type: "integer", nullable: true),
                    AttachmentUrls = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    UpdatedBy = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permits", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RiskAssessments",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AssessmentNumber = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    AssessmentDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ReviewDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    NextReviewDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Activity = table.Column<string>(type: "text", nullable: false),
                    Location = table.Column<string>(type: "text", nullable: false),
                    Department = table.Column<string>(type: "text", nullable: false),
                    Hazards = table.Column<string>(type: "text", nullable: false),
                    PotentialConsequences = table.Column<string>(type: "text", nullable: false),
                    InitialLikelihood = table.Column<int>(type: "integer", nullable: false),
                    InitialConsequence = table.Column<int>(type: "integer", nullable: false),
                    InitialRiskScore = table.Column<int>(type: "integer", nullable: false),
                    InitialRiskLevel = table.Column<int>(type: "integer", nullable: false),
                    ExistingControls = table.Column<string>(type: "text", nullable: false),
                    AdditionalControls = table.Column<string>(type: "text", nullable: false),
                    ResponsiblePerson = table.Column<string>(type: "text", nullable: false),
                    ImplementationDeadline = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ResidualLikelihood = table.Column<int>(type: "integer", nullable: false),
                    ResidualConsequence = table.Column<int>(type: "integer", nullable: false),
                    ResidualRiskScore = table.Column<int>(type: "integer", nullable: false),
                    ResidualRiskLevel = table.Column<int>(type: "integer", nullable: false),
                    AssessedBy = table.Column<string>(type: "text", nullable: false),
                    ApprovedBy = table.Column<string>(type: "text", nullable: false),
                    ApprovedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsApproved = table.Column<bool>(type: "boolean", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    RegulatoryRequirements = table.Column<string>(type: "text", nullable: false),
                    RequiresGovernmentNotification = table.Column<bool>(type: "boolean", nullable: false),
                    GovernmentNotificationDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AttachmentUrls = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    UpdatedBy = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RiskAssessments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    IsSystemRole = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    UpdatedBy = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TrainingRecords",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RecordNumber = table.Column<string>(type: "text", nullable: false),
                    EmployeeId = table.Column<string>(type: "text", nullable: false),
                    EmployeeName = table.Column<string>(type: "text", nullable: false),
                    EmployeeEmail = table.Column<string>(type: "text", nullable: false),
                    Department = table.Column<string>(type: "text", nullable: false),
                    Position = table.Column<string>(type: "text", nullable: false),
                    TrainingTitle = table.Column<string>(type: "text", nullable: false),
                    TrainingType = table.Column<string>(type: "text", nullable: false),
                    TrainingCategory = table.Column<string>(type: "text", nullable: false),
                    TrainingProvider = table.Column<string>(type: "text", nullable: false),
                    Instructor = table.Column<string>(type: "text", nullable: false),
                    Location = table.Column<string>(type: "text", nullable: false),
                    TrainingDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Duration = table.Column<TimeSpan>(type: "interval", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    RequiresRefresher = table.Column<bool>(type: "boolean", nullable: false),
                    RefresherFrequencyMonths = table.Column<int>(type: "integer", nullable: false),
                    IsCompleted = table.Column<bool>(type: "boolean", nullable: false),
                    CompletionDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Score = table.Column<decimal>(type: "numeric", nullable: true),
                    Passed = table.Column<bool>(type: "boolean", nullable: false),
                    CertificateNumber = table.Column<string>(type: "text", nullable: false),
                    CertificateUrl = table.Column<string>(type: "text", nullable: false),
                    IsRegulatoryRequired = table.Column<bool>(type: "boolean", nullable: false),
                    RegulatoryReference = table.Column<string>(type: "text", nullable: false),
                    RequiresSKKK = table.Column<bool>(type: "boolean", nullable: false),
                    SKKKNumber = table.Column<string>(type: "text", nullable: false),
                    RequiresKemnaker = table.Column<bool>(type: "boolean", nullable: false),
                    KemnakerNumber = table.Column<string>(type: "text", nullable: false),
                    MaterialUrls = table.Column<string>(type: "text", nullable: false),
                    AttendanceUrl = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    UpdatedBy = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingRecords", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Username = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    PasswordHash = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    FirstName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    EmployeeId = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Department = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Position = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    PhoneNumber = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    PreferredLanguage = table.Column<string>(type: "character varying(5)", maxLength: 5, nullable: false, defaultValue: "en"),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    IsEmailConfirmed = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    LastLoginDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    RefreshToken = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    RefreshTokenExpiryTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    FailedLoginAttempts = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    LockoutEndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    UpdatedBy = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IncidentCAPA",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IncidentId = table.Column<int>(type: "integer", nullable: false),
                    ActionNumber = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Priority = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    AssignedTo = table.Column<string>(type: "text", nullable: false),
                    AssignedByName = table.Column<string>(type: "text", nullable: false),
                    AssignedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CompletionDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ProgressPercentage = table.Column<int>(type: "integer", nullable: false),
                    ProgressNotes = table.Column<string>(type: "text", nullable: false),
                    CompletionEvidence = table.Column<string>(type: "text", nullable: false),
                    VerifiedBy = table.Column<string>(type: "text", nullable: false),
                    VerificationDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsEffective = table.Column<bool>(type: "boolean", nullable: false),
                    EffectivenessNotes = table.Column<string>(type: "text", nullable: false),
                    EstimatedCost = table.Column<decimal>(type: "numeric", nullable: false),
                    ActualCost = table.Column<decimal>(type: "numeric", nullable: false),
                    CostNotes = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    UpdatedBy = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IncidentCAPA", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IncidentCAPA_Incidents_IncidentId",
                        column: x => x.IncidentId,
                        principalSchema: "public",
                        principalTable: "Incidents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "IncidentInvestigation",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IncidentId = table.Column<int>(type: "integer", nullable: false),
                    LeadInvestigator = table.Column<string>(type: "text", nullable: false),
                    TeamMembers = table.Column<string>(type: "text", nullable: false),
                    TechnicalExperts = table.Column<string>(type: "text", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TargetCompletionDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ActualCompletionDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    InitialFindings = table.Column<string>(type: "text", nullable: false),
                    Methodology = table.Column<string>(type: "text", nullable: false),
                    InterviewNotes = table.Column<string>(type: "text", nullable: false),
                    EvidenceCollected = table.Column<string>(type: "text", nullable: false),
                    WitnessStatements = table.Column<string>(type: "text", nullable: false),
                    RootCauses = table.Column<string>(type: "text", nullable: false),
                    ContributingFactors = table.Column<string>(type: "text", nullable: false),
                    SystemicIssues = table.Column<string>(type: "text", nullable: false),
                    ImmediateActions = table.Column<string>(type: "text", nullable: false),
                    ShortTermActions = table.Column<string>(type: "text", nullable: false),
                    LongTermActions = table.Column<string>(type: "text", nullable: false),
                    PreventiveMeasures = table.Column<string>(type: "text", nullable: false),
                    ProgressPercentage = table.Column<int>(type: "integer", nullable: false),
                    ProgressNotes = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    UpdatedBy = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IncidentInvestigation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IncidentInvestigation_Incidents_IncidentId",
                        column: x => x.IncidentId,
                        principalSchema: "public",
                        principalTable: "Incidents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "IncidentNotification",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IncidentId = table.Column<int>(type: "integer", nullable: false),
                    NotificationType = table.Column<string>(type: "text", nullable: false),
                    RecipientRole = table.Column<string>(type: "text", nullable: false),
                    RecipientName = table.Column<string>(type: "text", nullable: false),
                    RecipientContact = table.Column<string>(type: "text", nullable: false),
                    Priority = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Subject = table.Column<string>(type: "text", nullable: false),
                    Message = table.Column<string>(type: "text", nullable: false),
                    Language = table.Column<string>(type: "text", nullable: false),
                    ScheduledTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    SentTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeliveredTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ReadTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    RetryCount = table.Column<int>(type: "integer", nullable: false),
                    MaxRetries = table.Column<int>(type: "integer", nullable: false),
                    ErrorMessage = table.Column<string>(type: "text", nullable: false),
                    IsRegulatoryRequired = table.Column<bool>(type: "boolean", nullable: false),
                    RegulatoryBody = table.Column<string>(type: "text", nullable: false),
                    RegulatoryDeadline = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    UpdatedBy = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IncidentNotification", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IncidentNotification_Incidents_IncidentId",
                        column: x => x.IncidentId,
                        principalSchema: "public",
                        principalTable: "Incidents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RolePermissions",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoleId = table.Column<int>(type: "integer", nullable: false),
                    PermissionId = table.Column<int>(type: "integer", nullable: false),
                    GrantedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RolePermissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RolePermissions_Permissions_PermissionId",
                        column: x => x.PermissionId,
                        principalSchema: "public",
                        principalTable: "Permissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RolePermissions_Roles_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "public",
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    RoleId = table.Column<int>(type: "integer", nullable: false),
                    AssignedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "public",
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "public",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                schema: "public",
                table: "Permissions",
                columns: new[] { "Id", "Action", "Description", "Module", "Name" },
                values: new object[,]
                {
                    { 1, "View", "View incidents", "Incidents", "incidents.view" },
                    { 2, "Create", "Create new incidents", "Incidents", "incidents.create" },
                    { 3, "Update", "Update existing incidents", "Incidents", "incidents.update" },
                    { 4, "Delete", "Delete incidents", "Incidents", "incidents.delete" },
                    { 5, "Investigate", "Investigate incidents", "Incidents", "incidents.investigate" },
                    { 6, "Approve", "Approve incident reports", "Incidents", "incidents.approve" },
                    { 7, "Report", "Generate incident reports", "Incidents", "incidents.report" },
                    { 8, "View", "View risk assessments", "Risks", "risks.view" },
                    { 9, "Create", "Create new risk assessments", "Risks", "risks.create" },
                    { 10, "Update", "Update existing risk assessments", "Risks", "risks.update" },
                    { 11, "Delete", "Delete risk assessments", "Risks", "risks.delete" },
                    { 12, "Approve", "Approve risk assessments", "Risks", "risks.approve" },
                    { 13, "Review", "Review risk assessments", "Risks", "risks.review" },
                    { 14, "View", "View permits", "Permits", "permits.view" },
                    { 15, "Create", "Create new permits", "Permits", "permits.create" },
                    { 16, "Update", "Update existing permits", "Permits", "permits.update" },
                    { 17, "Delete", "Delete permits", "Permits", "permits.delete" },
                    { 18, "Approve", "Approve permits", "Permits", "permits.approve" },
                    { 19, "Issue", "Issue permits", "Permits", "permits.issue" },
                    { 20, "View", "View training records", "Training", "training.view" },
                    { 21, "Create", "Create new training records", "Training", "training.create" },
                    { 22, "Update", "Update existing training records", "Training", "training.update" },
                    { 23, "Delete", "Delete training records", "Training", "training.delete" },
                    { 24, "Approve", "Approve training records", "Training", "training.approve" },
                    { 25, "View", "View compliance items", "Compliance", "compliance.view" },
                    { 26, "Create", "Create new compliance items", "Compliance", "compliance.create" },
                    { 27, "Update", "Update existing compliance items", "Compliance", "compliance.update" },
                    { 28, "Delete", "Delete compliance items", "Compliance", "compliance.delete" },
                    { 29, "View", "View reports", "Reports", "reports.view" },
                    { 30, "Create", "Create new reports", "Reports", "reports.create" },
                    { 31, "View", "View analytics", "Analytics", "analytics.view" },
                    { 32, "View", "View dashboard", "Dashboard", "dashboard.view" },
                    { 33, "View", "View users", "Users", "users.view" },
                    { 34, "Create", "Create new users", "Users", "users.create" },
                    { 35, "Update", "Update existing users", "Users", "users.update" },
                    { 36, "Delete", "Delete users", "Users", "users.delete" },
                    { 37, "ManageRoles", "Manage user roles", "Users", "users.manage_roles" },
                    { 38, "Settings", "Manage system settings", "System", "system.settings" },
                    { 39, "Audit", "View system audit logs", "System", "system.audit" },
                    { 40, "Backup", "Manage system backups", "System", "system.backup" }
                });

            migrationBuilder.InsertData(
                schema: "public",
                table: "Roles",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "Description", "IsActive", "IsSystemRole", "Name", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "System", "Full system access with all permissions", true, true, "System Administrator", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "System" },
                    { 2, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "System", "HSE department manager with full HSE module access", true, true, "HSE Manager", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "System" },
                    { 3, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "System", "HSE officer with operational HSE access", true, true, "HSE Officer", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "System" },
                    { 4, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "System", "School teacher with incident reporting access", true, true, "Teacher", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "System" },
                    { 5, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "System", "Student with limited reporting access", true, true, "Student", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "System" }
                });

            migrationBuilder.InsertData(
                schema: "public",
                table: "RolePermissions",
                columns: new[] { "Id", "GrantedDate", "IsActive", "PermissionId", "RoleId" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 1, 1 },
                    { 2, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 2, 1 },
                    { 3, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 3, 1 },
                    { 4, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 4, 1 },
                    { 5, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 5, 1 },
                    { 6, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 6, 1 },
                    { 7, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 7, 1 },
                    { 8, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 8, 1 },
                    { 9, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 9, 1 },
                    { 10, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 10, 1 },
                    { 11, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 11, 1 },
                    { 12, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 12, 1 },
                    { 13, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 13, 1 },
                    { 14, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 14, 1 },
                    { 15, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 15, 1 },
                    { 16, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 16, 1 },
                    { 17, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 17, 1 },
                    { 18, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 18, 1 },
                    { 19, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 19, 1 },
                    { 20, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 20, 1 },
                    { 21, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 21, 1 },
                    { 22, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 22, 1 },
                    { 23, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 23, 1 },
                    { 24, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 24, 1 },
                    { 25, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 25, 1 },
                    { 26, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 26, 1 },
                    { 27, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 27, 1 },
                    { 28, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 28, 1 },
                    { 29, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 29, 1 },
                    { 30, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 30, 1 },
                    { 31, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 31, 1 },
                    { 32, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 32, 1 },
                    { 33, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 33, 1 },
                    { 34, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 34, 1 },
                    { 35, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 35, 1 },
                    { 36, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 36, 1 },
                    { 37, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 37, 1 },
                    { 38, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 1, 2 },
                    { 39, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 2, 2 },
                    { 40, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 3, 2 },
                    { 41, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 4, 2 },
                    { 42, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 5, 2 },
                    { 43, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 6, 2 },
                    { 44, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 7, 2 },
                    { 45, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 8, 2 },
                    { 46, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 9, 2 },
                    { 47, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 10, 2 },
                    { 48, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 11, 2 },
                    { 49, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 12, 2 },
                    { 50, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 13, 2 },
                    { 51, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 14, 2 },
                    { 52, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 15, 2 },
                    { 53, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 16, 2 },
                    { 54, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 17, 2 },
                    { 55, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 18, 2 },
                    { 56, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 19, 2 },
                    { 57, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 20, 2 },
                    { 58, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 21, 2 },
                    { 59, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 22, 2 },
                    { 60, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 23, 2 },
                    { 61, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 24, 2 },
                    { 62, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 25, 2 },
                    { 63, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 26, 2 },
                    { 64, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 27, 2 },
                    { 65, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 28, 2 },
                    { 66, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 29, 2 },
                    { 67, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 30, 2 },
                    { 68, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 31, 2 },
                    { 69, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 32, 2 },
                    { 70, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 1, 3 },
                    { 71, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 2, 3 },
                    { 72, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 3, 3 },
                    { 73, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 5, 3 },
                    { 74, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 8, 3 },
                    { 75, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 9, 3 },
                    { 76, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 10, 3 },
                    { 77, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 14, 3 },
                    { 78, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 15, 3 },
                    { 79, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 16, 3 },
                    { 80, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 17, 3 },
                    { 81, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 20, 3 },
                    { 82, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 21, 3 },
                    { 83, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 22, 3 },
                    { 84, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 24, 3 },
                    { 85, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 25, 3 },
                    { 86, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 26, 3 },
                    { 87, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 27, 3 },
                    { 88, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 28, 3 },
                    { 89, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 29, 3 },
                    { 90, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 30, 3 },
                    { 91, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 31, 3 },
                    { 92, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 32, 3 },
                    { 93, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 1, 4 },
                    { 94, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 2, 4 },
                    { 95, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 8, 4 },
                    { 96, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 15, 4 },
                    { 97, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 25, 4 },
                    { 98, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 29, 4 },
                    { 99, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 32, 4 },
                    { 100, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 1, 5 },
                    { 101, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 2, 5 },
                    { 102, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, 32, 5 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_IncidentCAPA_IncidentId",
                schema: "public",
                table: "IncidentCAPA",
                column: "IncidentId");

            migrationBuilder.CreateIndex(
                name: "IX_IncidentInvestigation_IncidentId",
                schema: "public",
                table: "IncidentInvestigation",
                column: "IncidentId");

            migrationBuilder.CreateIndex(
                name: "IX_IncidentNotification_IncidentId",
                schema: "public",
                table: "IncidentNotification",
                column: "IncidentId");

            migrationBuilder.CreateIndex(
                name: "IX_Permissions_Module_Action",
                schema: "public",
                table: "Permissions",
                columns: new[] { "Module", "Action" });

            migrationBuilder.CreateIndex(
                name: "IX_Permissions_Name",
                schema: "public",
                table: "Permissions",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RolePermissions_PermissionId",
                schema: "public",
                table: "RolePermissions",
                column: "PermissionId");

            migrationBuilder.CreateIndex(
                name: "IX_RolePermissions_RoleId_PermissionId",
                schema: "public",
                table: "RolePermissions",
                columns: new[] { "RoleId", "PermissionId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Name",
                schema: "public",
                table: "Roles",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_RoleId",
                schema: "public",
                table: "UserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_UserId_RoleId",
                schema: "public",
                table: "UserRoles",
                columns: new[] { "UserId", "RoleId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                schema: "public",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_EmployeeId",
                schema: "public",
                table: "Users",
                column: "EmployeeId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_RefreshToken",
                schema: "public",
                table: "Users",
                column: "RefreshToken");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                schema: "public",
                table: "Users",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ComplianceItems",
                schema: "public");

            migrationBuilder.DropTable(
                name: "IncidentCAPA",
                schema: "public");

            migrationBuilder.DropTable(
                name: "IncidentInvestigation",
                schema: "public");

            migrationBuilder.DropTable(
                name: "IncidentNotification",
                schema: "public");

            migrationBuilder.DropTable(
                name: "Permits",
                schema: "public");

            migrationBuilder.DropTable(
                name: "RiskAssessments",
                schema: "public");

            migrationBuilder.DropTable(
                name: "RolePermissions",
                schema: "public");

            migrationBuilder.DropTable(
                name: "TrainingRecords",
                schema: "public");

            migrationBuilder.DropTable(
                name: "UserRoles",
                schema: "public");

            migrationBuilder.DropTable(
                name: "Incidents",
                schema: "public");

            migrationBuilder.DropTable(
                name: "Permissions",
                schema: "public");

            migrationBuilder.DropTable(
                name: "Roles",
                schema: "public");

            migrationBuilder.DropTable(
                name: "Users",
                schema: "public");
        }
    }
}
