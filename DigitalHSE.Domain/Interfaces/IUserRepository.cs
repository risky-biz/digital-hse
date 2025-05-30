using DigitalHSE.Domain.Auth;
using DigitalHSE.Domain.Common;

namespace DigitalHSE.Domain.Interfaces;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByUsernameAsync(string username);
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByRefreshTokenAsync(string refreshToken);
    Task<User?> GetUserWithRolesAndPermissionsAsync(int userId);
    Task<bool> IsUsernameExistsAsync(string username);
    Task<bool> IsEmailExistsAsync(string email);
    Task<List<User>> GetUsersByRoleAsync(string roleName);
    Task<List<User>> GetActiveUsersAsync();
}