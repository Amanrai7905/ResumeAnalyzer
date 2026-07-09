using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using ResumeAnalyzer.Application.Common;
using ResumeAnalyzer.Application.DTOs.Request;
using ResumeAnalyzer.Application.DTOs.Response;
using ResumeAnalyzer.Application.DTOs.Resume;
using ResumeAnalyzer.Application.Interfaces;
using ResumeAnalyzer.Domain.Entities;

namespace ResumeAnalyzer.Application.Services;

public class ResumeService : IResumeService
{
    private readonly IResumeRepository _resumeRepository;
    private readonly IFileService _fileService;
    private readonly IPdfService _pdfService;
    private readonly IAIService _aiService;

    public ResumeService(IResumeRepository resumeRepository, IFileService fileService, IPdfService pdfService, 
        IAIService aiService,ILogger<ResumeService> logger)
    {
        _resumeRepository = resumeRepository;
        _fileService = fileService;
        _pdfService = pdfService;
        _aiService = aiService;
    }


    public async Task<ResumeAnalysisResponse> AnalyzeResumeAsync(Stream stream,string fileName)
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
        var resumes = await _resumeRepository.GetAllAsync();

        return resumes.Select(r => new ResumeDto
        {
            Id = r.Id,
            FileName = r.FileName,
            ResumeScore = r.ResumeScore,
            AtsScore = r.AtsScore,
            Summary = r.Summary,
            UploadedAt = r.UploadedAt
        }).ToList();
    }

    public async Task<Resume?> GetByIdAsync(Guid id)
    {
        return await _resumeRepository.GetByIdAsync(id);
    }

    public async Task DeleteAsync(Guid id)
    {
        var resume = await _resumeRepository.GetByIdAsync(id);

        if (resume == null)
            throw new Exception("Resume not found.");

        await _resumeRepository.DeleteAsync(resume);
    }

    public async Task<PagedResponse<ResumeDto>> GetPagedAsync(ResumeQueryParameters query)
    {
        var (items, totalCount) = await _resumeRepository.GetPagedAsync(query);

        var resumeDtos = items.Select(r => new ResumeDto
        {
            Id = r.Id,
            FileName = r.FileName,
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


}