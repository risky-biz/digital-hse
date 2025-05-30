using Microsoft.AspNetCore.Mvc;
using DigitalHSE.Domain.Auth;
using DigitalHSE.Domain.Interfaces;
using DigitalHSE.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace DigitalHSE.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeedController : ControllerBase
{
    private readonly DigitalHSEDBContext _context;
    private readonly ILogger<SeedController> _logger;

    public SeedController(DigitalHSEDBContext context, ILogger<SeedController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Seeds the database with initial users and roles for testing
    /// WARNING: This should only be used in development
    /// </summary>
    [HttpPost("users")]
    public async Task<IActionResult> SeedUsers()
    {
        try
        {
            if (!HttpContext.Request.Host.Host.Contains("localhost"))
            {
                return Forbid("Seeding is only allowed in development environment");
            }

            // Check if users already exist
            var existingUsersCount = await _context.Users.CountAsync();
            if (existingUsersCount > 0)
            {
                return BadRequest("Users already exist in the database");
            }

            // Create test users with hashed passwords
            var users = new List<User>
            {
                new User(
                    username: "admin",
                    email: "admin@bsj.sch.id",
                    passwordHash: BCrypt.Net.BCrypt.HashPassword("admin123"),
                    firstName: "System",
                    lastName: "Administrator",
                    employeeId: "ADM001",
                    department: "IT",
                    position: "System Administrator",
                    phoneNumber: "+62-21-12345678",
                    preferredLanguage: "en"
                ),
                new User(
                    username: "hsemanager",
                    email: "hse.manager@bsj.sch.id",
                    passwordHash: BCrypt.Net.BCrypt.HashPassword("hse123"),
                    firstName: "Sarah",
                    lastName: "Johnson",
                    employeeId: "HSE001",
                    department: "Health, Safety & Environment",
                    position: "HSE Manager",
                    phoneNumber: "+62-21-12345679",
                    preferredLanguage: "en"
                ),
                new User(
                    username: "hseofficer",
                    email: "hse.officer@bsj.sch.id",
                    passwordHash: BCrypt.Net.BCrypt.HashPassword("hse123"),
                    firstName: "Ahmad",
                    lastName: "Wijaya",
                    employeeId: "HSE002",
                    department: "Health, Safety & Environment",
                    position: "HSE Officer",
                    phoneNumber: "+62-21-12345680",
                    preferredLanguage: "id"
                ),
                new User(
                    username: "teacher",
                    email: "teacher@bsj.sch.id",
                    passwordHash: BCrypt.Net.BCrypt.HashPassword("teacher123"),
                    firstName: "Emily",
                    lastName: "Chen",
                    employeeId: "TCH001",
                    department: "Academic",
                    position: "Primary Teacher",
                    phoneNumber: "+62-21-12345681",
                    preferredLanguage: "en"
                ),
                new User(
                    username: "student",
                    email: "student@bsj.sch.id",
                    passwordHash: BCrypt.Net.BCrypt.HashPassword("student123"),
                    firstName: "Alex",
                    lastName: "Smith",
                    employeeId: "STD001",
                    department: "Student",
                    position: "Year 6 Student",
                    phoneNumber: "+62-21-12345682",
                    preferredLanguage: "en"
                )
            };

            // Confirm emails for all test users
            foreach (var user in users)
            {
                user.ConfirmEmail();
            }

            await _context.Users.AddRangeAsync(users);
            await _context.SaveChangesAsync();

            // Assign roles to users
            var roles = await _context.Roles.ToListAsync();
            var userRoles = new List<UserRole>();

            // Admin user gets System Administrator role
            var adminUser = users.First(u => u.Username == "admin");
            var adminRole = roles.First(r => r.Name == "System Administrator");
            userRoles.Add(new UserRole(adminUser.Id, adminRole.Id));

            // HSE Manager gets HSE Manager role
            var hseManagerUser = users.First(u => u.Username == "hsemanager");
            var hseManagerRole = roles.First(r => r.Name == "HSE Manager");
            userRoles.Add(new UserRole(hseManagerUser.Id, hseManagerRole.Id));

            // HSE Officer gets HSE Officer role
            var hseOfficerUser = users.First(u => u.Username == "hseofficer");
            var hseOfficerRole = roles.First(r => r.Name == "HSE Officer");
            userRoles.Add(new UserRole(hseOfficerUser.Id, hseOfficerRole.Id));

            // Teacher gets Teacher role
            var teacherUser = users.First(u => u.Username == "teacher");
            var teacherRole = roles.First(r => r.Name == "Teacher");
            userRoles.Add(new UserRole(teacherUser.Id, teacherRole.Id));

            // Student gets Student role
            var studentUser = users.First(u => u.Username == "student");
            var studentRole = roles.First(r => r.Name == "Student");
            userRoles.Add(new UserRole(studentUser.Id, studentRole.Id));

            await _context.UserRoles.AddRangeAsync(userRoles);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Successfully seeded {UserCount} test users", users.Count);

            return Ok(new
            {
                message = "Test users created successfully",
                users = users.Select(u => new
                {
                    username = u.Username,
                    email = u.Email,
                    fullName = u.GetFullName(),
                    department = u.Department,
                    position = u.Position
                })
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding users");
            return StatusCode(500, new { message = "Error creating test users", error = ex.Message });
        }
    }

    /// <summary>
    /// Gets information about available test accounts
    /// </summary>
    [HttpGet("test-accounts")]
    public IActionResult GetTestAccounts()
    {
        var testAccounts = new[]
        {
            new { username = "admin", password = "admin123", role = "System Administrator", description = "Full system access" },
            new { username = "hsemanager", password = "hse123", role = "HSE Manager", description = "HSE department manager" },
            new { username = "hseofficer", password = "hse123", role = "HSE Officer", description = "HSE operational officer" },
            new { username = "teacher", password = "teacher123", role = "Teacher", description = "School teacher with incident reporting" },
            new { username = "student", password = "student123", role = "Student", description = "Student with limited access" }
        };

        return Ok(new
        {
            message = "Available test accounts for Digital HSE",
            accounts = testAccounts,
            note = "Use POST /api/seed/users to create these accounts in the database"
        });
    }
}