namespace DigitalHSE.Domain.Common;

public interface ICurrentUser
{
    string IPAddress { get; }
    string UserName { get; }
}