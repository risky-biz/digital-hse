#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["DigitalHSE.API/DigitalHSE.API.csproj", "DigitalHSE.API/"]
COPY ["BuildingBlocks/BuildingBlocks.API/BuildingBlocks.API.csproj", "BuildingBlocks/BuildingBlocks.API/"]
COPY ["BuildingBlocks/BuildingBlocks.Application/BuildingBlocks.Application.csproj", "BuildingBlocks/BuildingBlocks.Application/"]
COPY ["BuildingBlocks/BuildingBlocks.Domain/BuildingBlocks.Domain.csproj", "BuildingBlocks/BuildingBlocks.Domain/"]
COPY ["BuildingBlocks/BuildingBlocks.Resources/BuildingBlocks.Resources.csproj", "BuildingBlocks/BuildingBlocks.Resources/"]
COPY ["BuildingBlocks/BuildingBlocks.Infrastructure/BuildingBlocks.Infrastructure.csproj", "BuildingBlocks/BuildingBlocks.Infrastructure/"]
COPY ["DigitalHSE.Application/DigitalHSE.Application.csproj", "DigitalHSE.Application/"]
COPY ["DigitalHSE.Domain/DigitalHSE.Domain.csproj", "DigitalHSE.Domain/"]
COPY ["DigitalHSE.Resources/DigitalHSE.Resources.csproj", "DigitalHSE.Resources/"]
COPY ["DigitalHSE.Infrastructure/DigitalHSE.Infrastructure.csproj", "DigitalHSE.Infrastructure/"]
RUN dotnet restore "./DigitalHSE.API/DigitalHSE.API.csproj"
COPY . .
WORKDIR "/src/DigitalHSE.API"
RUN dotnet build "./DigitalHSE.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./DigitalHSE.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DigitalHSE.API.dll"]