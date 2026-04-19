# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY ["BuenosFrizados.API/BuenosFrizados.API.csproj", "BuenosFrizados.API/"]
COPY ["BuenosFrizados.Domain/BuenosFrizados.Domain.csproj", "BuenosFrizados.Domain/"]
COPY ["BuenosFrizados.Application/BuenosFrizados.Application.csproj", "BuenosFrizados.Application/"]
COPY ["BuenosFrizados.Infrastructure/BuenosFrizados.Infrastructure.csproj", "BuenosFrizados.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "BuenosFrizados.API/BuenosFrizados.API.csproj"

# Copy source code
COPY . .

# Build the application
WORKDIR "/src/BuenosFrizados.API"
RUN dotnet build "BuenosFrizados.API.csproj" -c Release -o /app/build

# Publish the application
RUN dotnet publish "BuenosFrizados.API.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://*:8080

ENTRYPOINT ["dotnet", "BuenosFrizados.API.dll"]