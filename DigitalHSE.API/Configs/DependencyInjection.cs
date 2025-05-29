using DigitalHSE.Domain.Interfaces;
using DigitalHSE.Infrastructure.Repositories;
using DigitalHSE.Infrastructure;
using Microsoft.EntityFrameworkCore;
using BuildingBlocks.Infrastructure.Implementations;
using DigitalHSE.Application;
using FluentValidation;
using BuildingBlocks.Application.Behaviours;
using MediatR;
using Swashbuckle.AspNetCore.Filters;

namespace DigitalHSE.API.Configs;

public static class DependencyInjection
{
    public static IServiceCollection Register(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .RegisterRepositories()
            .RegisterDBContext(configuration)
            .RegisterAuthentication()
            .RegisterMediatR()
            .RegisterValidator()
            .RegisterSwagger();

        return services;
    }
    private static IServiceCollection RegisterMediatR(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssemblyContaining(typeof(SampleModelMapper));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
        });

        return services;
    }

    private static IServiceCollection RegisterValidator(this IServiceCollection services)
    {
        services.AddValidatorsFromAssemblyContaining(typeof(SampleModelMapper));

        return services;
    }

    private static IServiceCollection RegisterRepositories(this IServiceCollection services)
    {
        services.AddScoped(typeof(IDigitalHSEUnitOfWork), typeof(DigitalHSEUnitOfWork));
        services.AddScoped(typeof(ISampleModelRepository), typeof(SampleModelRepository));
        services.AddScoped(typeof(IAnotherSampleModelRepository), typeof(AnotherSampleModelRepository));

        return services;
    }

    private static IServiceCollection RegisterDBContext(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<DigitalHSEDBContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")),
            ServiceLifetime.Scoped);
        services.AddScoped<DBContext>(provider => provider.GetService<DigitalHSEDBContext>()!);

        return services;
    }

    private static IServiceCollection RegisterAuthentication(this IServiceCollection services)
    {
        services.AddAuthorizationBuilder()
            .AddPolicy("CanDeletePolicy", policy =>
            policy.RequireClaim("Permissions", "CanDelete"));

        return services;
    }

    private static IServiceCollection RegisterSwagger(this IServiceCollection services)
    {
        services.AddSwaggerExamplesFromAssemblyOf(typeof(SampleModelMapper));

        return services;
    }
}
