using DigitalHSE.Application.Common;

namespace DigitalHSE.Application.Auth;

public interface IAuthService
{
    Task<Result<AuthResponse>> LoginAsync(LoginRequest request);
    Task<Result<AuthResponse>> RefreshTokenAsync(string refreshToken);
    Task<Result> LogoutAsync(string refreshToken);
    Task<Result> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
    Task<Result<UserPermissions>> GetUserPermissionsAsync(int userId);
}

public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class AuthResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public UserInfo User { get; set; } = null!;
}

public class UserInfo
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = new();
    public List<string> Permissions { get; set; } = new();
}

public class UserPermissions
{
    public int UserId { get; set; }
    public List<string> Permissions { get; set; } = new();
    public List<string> Roles { get; set; } = new();
}