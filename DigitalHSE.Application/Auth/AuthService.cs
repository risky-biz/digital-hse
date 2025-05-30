using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using DigitalHSE.Application.Common;
using DigitalHSE.Domain.Interfaces;
using DigitalHSE.Domain.Auth;

namespace DigitalHSE.Application.Auth;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IDigitalHSEUnitOfWork _unitOfWork;
    private readonly JwtSettings _jwtSettings;

    public AuthService(IUserRepository userRepository, IDigitalHSEUnitOfWork unitOfWork, IOptions<JwtSettings> jwtSettings)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _jwtSettings = jwtSettings.Value;
    }

    public async Task<Result<AuthResponse>> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetByUsernameAsync(request.Username);
        
        if (user == null)
        {
            return Result<AuthResponse>.CreateError("Invalid username or password");
        }

        if (!user.CanLogin())
        {
            var lockoutMessage = user.IsLockedOut() 
                ? "Account is temporarily locked due to multiple failed login attempts"
                : "Account is not active";
            return Result<AuthResponse>.CreateError(lockoutMessage);
        }

        if (!VerifyPassword(request.Password, user.PasswordHash))
        {
            user.RecordFailedLogin();
            await _unitOfWork.SaveChangesAsync();
            return Result<AuthResponse>.CreateError("Invalid username or password");
        }

        // Generate tokens
        var accessToken = GenerateAccessToken(user);
        var refreshToken = GenerateRefreshToken();
        var expiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes);

        // Update user login info
        user.UpdateLastLogin();
        user.SetRefreshToken(refreshToken, DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpiryDays));
        await _unitOfWork.SaveChangesAsync();

        // Get user permissions
        var userPermissions = await GetUserPermissionsAsync(user.Id);
        var permissions = userPermissions.Success ? userPermissions.Value!.Permissions : new List<string>();
        var roles = userPermissions.Success ? userPermissions.Value!.Roles : new List<string>();

        var response = new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = expiresAt,
            User = new UserInfo
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FullName = user.GetFullName(),
                Department = user.Department,
                Position = user.Position,
                Roles = roles,
                Permissions = permissions
            }
        };

        return Result<AuthResponse>.CreateSuccess(response);
    }

    public async Task<Result<AuthResponse>> RefreshTokenAsync(string refreshToken)
    {
        var user = await _userRepository.GetByRefreshTokenAsync(refreshToken);
        
        if (user == null || user.RefreshToken != refreshToken || 
            user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            return Result<AuthResponse>.CreateError("Invalid refresh token");
        }

        if (!user.CanLogin())
        {
            return Result<AuthResponse>.CreateError("Account is not active");
        }

        // Generate new tokens
        var newAccessToken = GenerateAccessToken(user);
        var newRefreshToken = GenerateRefreshToken();
        var expiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes);

        // Update refresh token
        user.SetRefreshToken(newRefreshToken, DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpiryDays));
        await _unitOfWork.SaveChangesAsync();

        // Get user permissions
        var userPermissions = await GetUserPermissionsAsync(user.Id);
        var permissions = userPermissions.Success ? userPermissions.Value!.Permissions : new List<string>();
        var roles = userPermissions.Success ? userPermissions.Value!.Roles : new List<string>();

        var response = new AuthResponse
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
            ExpiresAt = expiresAt,
            User = new UserInfo
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FullName = user.GetFullName(),
                Department = user.Department,
                Position = user.Position,
                Roles = roles,
                Permissions = permissions
            }
        };

        return Result<AuthResponse>.CreateSuccess(response);
    }

    public async Task<Result> LogoutAsync(string refreshToken)
    {
        var user = await _userRepository.GetByRefreshTokenAsync(refreshToken);
        
        if (user != null)
        {
            user.RevokeRefreshToken();
            await _unitOfWork.SaveChangesAsync();
        }

        return Result.CreateSuccess();
    }

    public async Task<Result> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        
        if (user == null)
        {
            var result = Result.CreateError("User not found");
            return result;
        }

        if (!VerifyPassword(currentPassword, user.PasswordHash))
        {
            return Result.CreateError("Current password is incorrect");
        }

        var newPasswordHash = HashPassword(newPassword);
        user.ChangePassword(newPasswordHash);
        await _unitOfWork.SaveChangesAsync();

        return Result.CreateSuccess();
    }

    public async Task<Result<UserPermissions>> GetUserPermissionsAsync(int userId)
    {
        var userWithRoles = await _userRepository.GetUserWithRolesAndPermissionsAsync(userId);
        
        if (userWithRoles == null)
        {
            return Result<UserPermissions>.CreateError("User not found");
        }

        var permissions = userWithRoles.UserRoles
            .Where(ur => ur.IsValid())
            .SelectMany(ur => ur.Role.RolePermissions)
            .Where(rp => rp.IsActive)
            .Select(rp => rp.Permission.Name)
            .Distinct()
            .ToList();

        var roles = userWithRoles.UserRoles
            .Where(ur => ur.IsValid())
            .Select(ur => ur.Role.Name)
            .ToList();

        var userPermissions = new UserPermissions
        {
            UserId = userId,
            Permissions = permissions,
            Roles = roles
        };

        return Result<UserPermissions>.CreateSuccess(userPermissions);
    }

    private string GenerateAccessToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_jwtSettings.SecretKey);
        
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Username),
            new(ClaimTypes.Email, user.Email),
            new("FullName", user.GetFullName()),
            new("Department", user.Department),
            new("Position", user.Position)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes),
            Issuer = _jwtSettings.Issuer,
            Audience = _jwtSettings.Audience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private static string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    private static string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    private static bool VerifyPassword(string password, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }
}