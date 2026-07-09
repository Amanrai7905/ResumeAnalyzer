Project Title:
# AI Resume Analyzer

Project Description:
# AI Resume Analyzer is an enterprise ASP.NET Core Web API application that analyzes resumes using AI. It allows users to upload resumes,
# receive AI-generated analysis, and securely manage their accounts using JWT Authentication and Refresh Tokens.

## Features
- User Registration & Login
- JWT Authentication
- Refresh Token Authentication
- Resume Upload
- AI Resume Analysis
- PDF File Support
- Pagination
- Global Exception Handling
- FluentValidation
- Serilog Logging
- AutoMapper
- Clean Architecture

## Tech Stack

Backend
- ASP.NET Core 8 Web API
- Entity Framework Core
- SQL Server

Authentication
- JWT
- Refresh Token

Architecture
- Clean Architecture
- Repository Pattern
- Dependency Injection

Validation
- FluentValidation

Logging
- Serilog

AI
- Groq API

Tools
- Swagger
- Git
- GitHub



## Project Structure

ResumeAnalyzer
│
├── ResumeAnalyzer.API
├── ResumeAnalyzer.Application
├── ResumeAnalyzer.Domain
├── ResumeAnalyzer.Infrastructure
└── ResumeAnalyzer.sln

API
- Controllers
- Middleware
- Dependency Injection

Application
- Business Logic
- DTOs
- Interfaces
- Services

Domain
- Entities
- Common Models

Infrastructure
- Database
- Repository
- External Services

## Database

SQL Server
Entity Framework Core
Code First Approach


## Authentication

JWT Access Token
Refresh Token
Password Hashing
Role-based Authorization (Future)

## API Endpoints
POST /api/auth/register

POST /api/auth/login

POST /api/auth/refresh

GET /api/resume

POST /api/resume/upload

DELETE /api/resume/{id}


##Installation 

1. Clone the repository

2. Open ResumeAnalyzer.sln

3. Update appsettings.json

4. Run Database Migration

5. Run the API

6. Open Swagger


## Future Improvements

- Redis Cache
- Docker
- Azure Deployment
- CI/CD
- Email Verification
- Background Jobs
- Unit Testing
- Integration Testing

## Author

Aman Rai

.NET Full Stack Developer


# Changelog

## v1.0.0

### Added
- Clean Architecture
- Repository Pattern
- JWT Authentication
- Refresh Token Authentication
- Redis Caching
- AutoMapper
- Serilog
- FluentValidation
- Pagination




GitHub
LinkedIn
Email


