using Microsoft.Extensions.DependencyInjection;

namespace DigitalHSE.Application.Common;

public class Mediator : IMediator
{
    private readonly IServiceProvider _serviceProvider;

    public Mediator(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task<TResponse> Send<TResponse>(IRequest<TResponse> request, CancellationToken cancellationToken = default)
    {
        if (request == null)
            throw new ArgumentNullException(nameof(request));

        var requestType = request.GetType();
        var responseType = typeof(TResponse);
        var handlerType = typeof(IRequestHandler<,>).MakeGenericType(requestType, responseType);

        var handler = _serviceProvider.GetService(handlerType);
        if (handler == null)
            throw new InvalidOperationException($"No handler registered for {requestType.Name}");

        var handleMethod = handlerType.GetMethod("Handle");
        if (handleMethod == null)
            throw new InvalidOperationException($"Handle method not found on handler for {requestType.Name}");

        var result = handleMethod.Invoke(handler, new object[] { request, cancellationToken });
        
        if (result is Task<TResponse> taskResult)
            return await taskResult;
        
        throw new InvalidOperationException($"Handler for {requestType.Name} did not return expected Task<{responseType.Name}>");
    }

    public async Task Send(IRequest request, CancellationToken cancellationToken = default)
    {
        await Send<Unit>(request, cancellationToken);
    }
}