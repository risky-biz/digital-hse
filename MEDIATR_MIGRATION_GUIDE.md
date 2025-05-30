# MediatR Migration Guide

This guide explains how to migrate from MediatR to our custom mediator implementation.

## Why Migrate?

- MediatR is planning to go commercial in future versions
- Our custom implementation gives us full control
- No external dependencies or licensing concerns
- Simpler and tailored to our needs

## Migration Steps

### 1. Update Command/Query Base Classes

**Before (MediatR):**
```csharp
using MediatR;

public class CreateIncidentCommand : IRequest<Result<int>>
{
    // properties
}
```

**After (Custom):**
```csharp
using DigitalHSE.Application.Common;

public class CreateIncidentCommand : IRequest<Result<int>>
{
    // properties
}
```

### 2. Update Handlers

**Before (MediatR):**
```csharp
using MediatR;

public class CreateIncidentCommandHandler : IRequestHandler<CreateIncidentCommand, Result<int>>
{
    public async Task<Result<int>> Handle(CreateIncidentCommand request, CancellationToken cancellationToken)
    {
        // implementation
    }
}
```

**After (Custom):**
```csharp
using DigitalHSE.Application.Common;

public class CreateIncidentCommandHandler : IRequestHandler<CreateIncidentCommand, Result<int>>
{
    public async Task<Result<int>> Handle(CreateIncidentCommand request, CancellationToken cancellationToken)
    {
        // implementation remains the same
    }
}
```

### 3. Update Program.cs

**Before (MediatR):**
```csharp
using MediatR;

// Add MediatR
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CreateIncidentCommand).Assembly));
```

**After (Custom):**
```csharp
using DigitalHSE.Application.Common;

// Add Simple Mediator
builder.Services.AddSimpleMediator(typeof(CreateIncidentCommand).Assembly);
```

### 4. Update Controllers

**Before (MediatR):**
```csharp
using MediatR;

public class IncidentController : ControllerBase
{
    private readonly IMediator _mediator;
    
    public IncidentController(IMediator mediator)
    {
        _mediator = mediator;
    }
}
```

**After (Custom):**
```csharp
using DigitalHSE.Application.Common;

public class IncidentController : ControllerBase
{
    private readonly IMediator _mediator;
    
    public IncidentController(IMediator mediator)
    {
        _mediator = mediator;
    }
}
```

## Features Comparison

| Feature | MediatR | Our Implementation |
|---------|---------|-------------------|
| Basic Send | ✅ | ✅ |
| Request/Response | ✅ | ✅ |
| Async Support | ✅ | ✅ |
| DI Integration | ✅ | ✅ |
| Pipeline Behaviors | ✅ | ❌ (can be added) |
| Notifications | ✅ | ❌ (not needed) |
| License | Future Commercial | MIT/Apache |

## Benefits of Our Implementation

1. **No External Dependencies**: Complete control over the code
2. **Simpler**: Only implements what we need
3. **Performant**: No reflection overhead for pipelines we don't use
4. **Future-Proof**: No licensing concerns
5. **Customizable**: Easy to extend for our specific needs

## To Implement Migration

Run these commands:

1. Remove MediatR package:
```bash
dotnet remove package MediatR
dotnet remove package MediatR.Extensions.Microsoft.DependencyInjection
```

2. Update all using statements:
```bash
# Find and replace in all .cs files:
# "using MediatR;" → "using DigitalHSE.Application.Common;"
```

3. Update Program.cs registration as shown above

4. Build and test:
```bash
dotnet build
dotnet test
```

## Future Enhancements (Optional)

If needed, we can add:
- Pipeline behaviors for validation
- Pipeline behaviors for logging
- Performance monitoring
- Caching support

These can be implemented as decorators or middleware without changing the core interface.