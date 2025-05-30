namespace DigitalHSE.Application.Common;

public interface IRequest<out TResponse>
{
}

public interface IRequest : IRequest<Unit>
{
}

public struct Unit
{
    public static readonly Unit Value = new();
}