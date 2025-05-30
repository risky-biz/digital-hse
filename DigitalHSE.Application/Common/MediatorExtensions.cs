using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace DigitalHSE.Application.Common;

public static class MediatorExtensions
{
    public static IServiceCollection AddSimpleMediator(this IServiceCollection services, params Assembly[] assemblies)
    {
        services.AddScoped<IMediator, Mediator>();

        // Register all handlers
        foreach (var assembly in assemblies)
        {
            var handlerTypes = assembly.GetTypes()
                .Where(t => t.IsClass && !t.IsAbstract && !t.IsGenericType)
                .Where(t => t.GetInterfaces().Any(i => 
                    i.IsGenericType && 
                    i.GetGenericTypeDefinition() == typeof(IRequestHandler<,>)))
                .ToList();

            foreach (var handlerType in handlerTypes)
            {
                var interfaces = handlerType.GetInterfaces()
                    .Where(i => i.IsGenericType && 
                               i.GetGenericTypeDefinition() == typeof(IRequestHandler<,>));

                foreach (var handlerInterface in interfaces)
                {
                    services.AddScoped(handlerInterface, handlerType);
                }
            }
        }

        return services;
    }
}