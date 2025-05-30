namespace DigitalHSE.Application.Common;

public interface ICommandQuery<TResponse> : IRequest<Result<TResponse>>
{
}

public interface ICommandQueryHandler<TRequest, TResponse> : IRequestHandler<TRequest, Result<TResponse>>
    where TRequest : ICommandQuery<TResponse>
{
}