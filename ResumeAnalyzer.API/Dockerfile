# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["ResumeAnalyzer.API/ResumeAnalyzer.API.csproj", "ResumeAnalyzer.API/"]
COPY ["ResumeAnalyzer.Application/ResumeAnalyzer.Application.csproj", "ResumeAnalyzer.Application/"]
COPY ["ResumeAnalyzer.Domain/ResumeAnalyzer.Domain.csproj", "ResumeAnalyzer.Domain/"]
COPY ["ResumeAnalyzer.Infrastructure/ResumeAnalyzer.Infrastructure.csproj", "ResumeAnalyzer.Infrastructure/"]

RUN dotnet restore "ResumeAnalyzer.API/ResumeAnalyzer.API.csproj"

COPY . .

WORKDIR "/src/ResumeAnalyzer.API"

RUN dotnet publish "ResumeAnalyzer.API.csproj" -c Release -o /app/publish

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0

WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "ResumeAnalyzer.API.dll"]