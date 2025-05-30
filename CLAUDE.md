# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Build Commands
```bash
# Build the entire solution
dotnet build

# Build specific project
dotnet build DigitalHSE.API/DigitalHSE.API.csproj

# Build in Release mode
dotnet build -c Release
```

### Run Commands
```bash
# Run main API service
dotnet run --project DigitalHSE.API

# Run secondary API service
dotnet run --project AnotherDigitalHSE.API

# Run load balancer
dotnet run --project AnotherDigitalHSE.LoadBalancer

# Run Web application (Frontend + Backend)
dotnet run --project DigitalHSE.Web
# Or for development with hot reload:
dotnet watch run --project DigitalHSE.Web

# Run all services with Docker Compose
docker-compose up -d

# Run specific service
docker-compose up digitalhse.api
```

### Test Commands
```bash
# Run all tests
dotnet test

# Run tests for specific project
dotnet test DigitalHSE.Test/DigitalHSE.Test.csproj

# Run tests with detailed output
dotnet test --logger "console;verbosity=detailed"
```

### Database Commands
```bash
# Apply migrations for PostgreSQL database
dotnet ef database update --project DigitalHSE.Infrastructure --startup-project DigitalHSE.Web

# Add new migration
dotnet ef migrations add MigrationName --project DigitalHSE.Infrastructure --startup-project DigitalHSE.Web

# Remove last migration (if not yet applied)
dotnet ef migrations remove --project DigitalHSE.Infrastructure --startup-project DigitalHSE.Web

# Generate migration script
dotnet ef migrations script --project DigitalHSE.Infrastructure --startup-project DigitalHSE.Web
```

## Architecture Overview

This solution follows Clean Architecture with Domain-Driven Design (DDD) principles:

### Layer Structure
1. **Domain Layer** - Core business entities and interfaces (no dependencies)
2. **Application Layer** - Use cases, CQRS commands/queries, business logic
3. **Infrastructure Layer** - Data access, external services, persistence
4. **API Layer** - REST endpoints, middleware, presentation logic

### Web Project (DigitalHSE.Web)
The solution now includes a unified Web project that combines:
- **Backend**: ASP.NET Core 8 Web API
- **Frontend**: CoreUI React with TypeScript
- **SPA Hosting**: Integrated React app served by .NET
- **Development**: Hot reload for both C# and React code
- Located in `/DigitalHSE.Web` with React app in `/DigitalHSE.Web/ClientApp`

### Key Architectural Patterns

#### CQRS with MediatR
- Commands and Queries are separated in the Application layer
- Each command/query has its own handler
- Validation is done using FluentValidation
- Results are wrapped in a Result<T> pattern

#### Repository Pattern with Unit of Work
- Generic repository interfaces in BuildingBlocks.Domain
- Concrete implementations in Infrastructure layer
- Support for both Entity Framework Core and Dapper
- Unit of Work pattern for transaction management

#### Shared Building Blocks
The BuildingBlocks folder contains reusable components:
- **BuildingBlocks.Domain**: Base entities, repository interfaces, specifications
- **BuildingBlocks.Application**: Global exception handling, behaviors, DTOs, middlewares
- **BuildingBlocks.Infrastructure**: Generic repository implementations, base DbContext
- **BuildingBlocks.API**: Base controllers, Swagger configuration, health checks
- **BuildingBlocks.Resources**: Localization resources

### Infrastructure Services

The solution uses PostgreSQL as the primary database and includes the following infrastructure services orchestrated with Docker:

1. **DigitalHSE.Web** (Port configured in launchSettings.json)
   - Unified Web application with React frontend and .NET backend
   - PostgreSQL database for all data persistence
   - JWT authentication
   - React SPA with CoreUI for the UI

2. **Infrastructure Services**:
   - **PostgreSQL** (Port 5432) - Primary database
   - **PgAdmin** (Port 5050) - Database management interface
   - **Redis** (Port 6379) - Caching and session storage
   - **RabbitMQ** (Ports 5672, 15672) - Message queue for async operations
   - **Elasticsearch** (Port 9200) - Centralized logging
   - **Kibana** (Port 5601) - Log visualization and search
   - **Prometheus** (Port 9090) - Metrics collection
   - **Grafana** (Port 3000) - Monitoring dashboards

### Database Configuration

The solution uses PostgreSQL 17 as the primary database:
- Connection string in appsettings.json
- Entity Framework Core with Npgsql provider
- Migrations stored in DigitalHSE.Infrastructure/Migrations
- Support for both EF Core and Dapper for data access

### Important Middleware and Features

1. **Global Exception Handling** - Centralized error handling with appropriate HTTP status codes
2. **Rate Limiting** - IP-based rate limiting middleware
3. **Idempotency** - Prevents duplicate request processing
4. **Health Checks** - Endpoint health monitoring
5. **Multi-language Support** - Resource files for internationalization
6. **API Versioning** - Support for multiple API versions
7. **Swagger/OpenAPI** - API documentation with JWT support

### Key Dependencies
- .NET 8
- Entity Framework Core 8
- Dapper for complex queries
- MediatR for CQRS
- FluentValidation
- Serilog for structured logging
- AutoMapper for object mapping
- Hangfire for background jobs
- YARP for reverse proxy