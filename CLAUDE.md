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
# Apply migrations for main database (SQL Server)
dotnet ef database update --project DigitalHSE.Infrastructure --startup-project DigitalHSE.API

# Apply migrations for secondary database (PostgreSQL)
dotnet ef database update --project AnotherDigitalHSE.API

# Add new migration
dotnet ef migrations add MigrationName --project DigitalHSE.Infrastructure --startup-project DigitalHSE.API
```

## Architecture Overview

This solution follows Clean Architecture with Domain-Driven Design (DDD) principles:

### Layer Structure
1. **Domain Layer** - Core business entities and interfaces (no dependencies)
2. **Application Layer** - Use cases, CQRS commands/queries, business logic
3. **Infrastructure Layer** - Data access, external services, persistence
4. **API Layer** - REST endpoints, middleware, presentation logic

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

### Microservices Architecture

The solution includes multiple services orchestrated with Docker:

1. **DigitalHSE.API** (Port 7100)
   - Main service with SQL Server database
   - JWT authentication
   - Hangfire for background jobs
   - Feature management support

2. **AnotherDigitalHSE.API** (3 instances: Ports 6001-6003)
   - Secondary service with PostgreSQL database
   - RabbitMQ integration
   - Horizontal scaling demonstration

3. **AnotherDigitalHSE.LoadBalancer** (Port 5020)
   - YARP-based reverse proxy
   - Load balancing across AnotherDigitalHSE instances

4. **Infrastructure Services**:
   - Redis (Port 6379) - Caching
   - RabbitMQ (Ports 5672, 15672) - Message queue
   - SQL Server (Port 1433)
   - PostgreSQL (Port 5432)
   - Elasticsearch (Port 9200) - Logging
   - Kibana (Port 5601) - Log visualization
   - Prometheus (Port 9090) - Metrics
   - Grafana (Port 3000) - Monitoring dashboards

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