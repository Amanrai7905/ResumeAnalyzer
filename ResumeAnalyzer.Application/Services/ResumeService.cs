using Hangfire;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using ResumeAnalyzer.Application.Common;
using ResumeAnalyzer.Application.DTOs.Request;
using ResumeAnalyzer.Application.DTOs.Response;
using ResumeAnalyzer.Application.DTOs.Resume;
using ResumeAnalyzer.Application.Interfaces;
using ResumeAnalyzer.Application.Jobs;
using System.Text.Json;
using ResumeAnalyzer.Domain.Entities;
using Microsoft.AspNetCore.SignalR;
using ResumeAnalyzer.Application.Hubs;
using ResumeAnalyzer.Application.DTOs.AI;

namespace ResumeAnalyzer.Application.Services;

public class ResumeService : IResumeService
{
    private readonly IResumeRepository _resumeRepository;
    private readonly IFileService _fileService;
    private readonly IPdfService _pdfService;
    private readonly IAIService _aiService;
    private readonly IHubContext<ResumeHub> _hubContext;
    private readonly ICacheService _cacheService;

    public ResumeService(IResumeRepository resumeRepository, IFileService fileService, IPdfService pdfService,
        IAIService aiService, ILogger<ResumeService> logger, ICacheService cacheService, IHubContext<ResumeHub> hubContext)
    {
        _resumeRepository = resumeRepository;
        _fileService = fileService;
        _pdfService = pdfService;
        _aiService = aiService;
        _cacheService = cacheService;
        _hubContext = hubContext;
    }


    public async Task<ResumeAnalysisResponse> AnalyzeResumeAsync(Stream stream, string fileName)
    {
        var filePath = await _fileService.SaveFileAsync(stream, fileName);
        var resumeText = await _pdfService.ExtractTextAsync(filePath);
        var aiResult = await _aiService.AnalyzeResumeAsync(resumeText);

        // Step 4: Save to database
        var resume = new Resume
        {
            FileName = fileName,
            FilePath = filePath,
            ResumeScore = aiResult.ResumeScore,
            AtsScore = aiResult.AtsScore,
            Summary = aiResult.Summary
        };

        await _resumeRepository.AddAsync(resume);
        await _cacheService.RemoveAsync("all_resumes");
        // Step 5: Return response
        return new ResumeAnalysisResponse
        {
            ResumeScore = aiResult.ResumeScore,
            AtsScore = aiResult.AtsScore,
            Skills = aiResult.Skills,
            MissingSkills = aiResult.MissingSkills,
            Suggestions = aiResult.Suggestions,
            Summary = aiResult.Summary
        };
    }

    public async Task<List<ResumeDto>> GetAllAsync()
    {
        const string cacheKey = "all_resumes";

        // 1. Check Redis
        var cachedResumes = await _cacheService.GetAsync<List<ResumeDto>>(cacheKey);

        if (cachedResumes != null)
        {
            return cachedResumes;
        }

        // 2. Get from Database
        var resumes = await _resumeRepository.GetAllAsync();

        var result = resumes.Select(r => new ResumeDto
        {
            Id = r.Id,
            FileName = r.FileName,
            Status = r.Status,
            ResumeScore = r.ResumeScore,
            AtsScore = r.AtsScore,
            Summary = r.Summary,
            UploadedAt = r.UploadedAt
        }).ToList();

        // 3. Save into Redis
        await _cacheService.SetAsync(cacheKey, result, TimeSpan.FromMinutes(5));

        return result;
    }

    public async Task<Resume?> GetByIdAsync(Guid id)
    {
        return await _resumeRepository.GetByIdAsync(id);
    }

    public async Task<ResumeDto> GetResumeByIdAsync(Guid id)
    {
        var resume = await _resumeRepository.GetByIdAsync(id);

        if (resume == null)
        {
            return null;
        }

        return new ResumeDto
        {
            Id = resume.Id,
            FileName = resume.FileName,
            Status = resume.Status,
            ResumeScore = resume.ResumeScore,
            AtsScore = resume.AtsScore,
            Summary = resume.Summary,

            Skills = string.IsNullOrWhiteSpace(resume.Skills)
                ? new List<string>()
                : JsonSerializer.Deserialize<List<string>>(resume.Skills),

            MissingSkills = string.IsNullOrWhiteSpace(resume.MissingSkills)
                ? new List<string>()
                : JsonSerializer.Deserialize<List<string>>(resume.MissingSkills),

            Suggestions = string.IsNullOrWhiteSpace(resume.Suggestions)
                ? new List<string>()
                : JsonSerializer.Deserialize<List<string>>(resume.Suggestions)
        };
    }

    public async Task DeleteAsync(Guid id)
    {
        var resume = await _resumeRepository.GetByIdAsync(id);

        if (resume == null)
            throw new Exception("Resume not found.");

        // Delete physical PDF
        await _fileService.DeleteFileAsync(resume.FilePath);

        // Delete database record
        await _resumeRepository.DeleteAsync(resume);

        // Remove Redis cache
        await _cacheService.RemoveAsync("all_resumes");
    }

    public async Task<PagedResponse<ResumeDto>> GetPagedAsync(ResumeQueryParameters query)
    {
        var (items, totalCount) = await _resumeRepository.GetPagedAsync(query);

        var resumeDtos = items.Select(r => new ResumeDto
        {
            Id = r.Id,
            FileName = r.FileName,
            Status = r.Status,
            ResumeScore = r.ResumeScore,
            AtsScore = r.AtsScore,
            Summary = r.Summary,
            UploadedAt = r.UploadedAt
        }).ToList();

        return new PagedResponse<ResumeDto>
        {
            Items = resumeDtos,
            PageNumber = query.PageNumber,
            PageSize = query.PageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)query.PageSize)
        };
    }

    public async Task ProcessResumeAnalysisAsync(Guid resumeId)
    {

        var resume = await _resumeRepository.GetByIdAsync(resumeId);

        if (resume == null)
            throw new Exception("Resume not found.");

        resume.Status = "Processing";
        await _resumeRepository.UpdateAsync(resume);

        var resumeText = await _pdfService.ExtractTextAsync(resume.FilePath);

        var aiResult = await _aiService.AnalyzeResumeAsync (resumeText);

        // Check again because the user may have deleted
        // the resume while AI analysis was running.
        resume = await _resumeRepository.GetByIdAsync(resumeId);

        if (resume == null)
        {
            return;
        }

        resume.ResumeScore = aiResult.ResumeScore;
        resume.AtsScore = aiResult.AtsScore;
        resume.Summary = aiResult.Summary;
        resume.Status = "Completed";
        resume.Skills = JsonSerializer.Serialize(aiResult.Skills);
        resume.MissingSkills = JsonSerializer.Serialize(aiResult.MissingSkills);
        resume.Suggestions = JsonSerializer.Serialize(aiResult.Suggestions);
        resume.UpdatedAt = DateTime.UtcNow;
        await _resumeRepository.UpdateAsync(resume);

        await _cacheService.RemoveAsync("all_resumes");
        await _hubContext.Clients.All.SendAsync("ResumeAnalysisCompleted",
        new
        {
            Id = resume.Id,
            FileName = resume.FileName,
            Status = resume.Status,
            ResumeScore = resume.ResumeScore,
            AtsScore = resume.AtsScore,
            Summary = resume.Summary
        });

    }

    public async Task<Guid> UploadResumeAsync(Stream stream, string fileName)
    {
        var filePath = await _fileService.SaveFileAsync(stream, fileName);

        var resume = new Resume
        {
            FileName = fileName,
            FilePath = filePath,
            Status = "Pending"
        };

        await _resumeRepository.AddAsync(resume);
        // Invalidate cached resume list
        await _cacheService.RemoveAsync("all_resumes");

        BackgroundJob.Enqueue<ResumeAnalysisJob>(x => x.AnalyzeResumeAsync(resume.Id));

        return resume.Id;
    }

    public async Task<JobMatchResult> MatchResumeWithJobAsync(Guid resumeId,string jobDescription)
    {
        if (string.IsNullOrWhiteSpace(jobDescription))
        {
            throw new ArgumentException("Job description is required.");
        }

        var resume = await _resumeRepository.GetByIdAsync(resumeId);

        if (resume == null)
        {
            throw new Exception("Resume not found.");
        }

        var resumeText = await _pdfService.ExtractTextAsync(resume.FilePath);

        var result = await _aiService.MatchResumeWithJobAsync(resumeText,jobDescription);

        return result;
    }

}