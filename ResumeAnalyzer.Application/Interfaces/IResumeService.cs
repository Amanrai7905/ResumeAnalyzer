using Microsoft.AspNetCore.Http;
using ResumeAnalyzer.Application.Common;
using ResumeAnalyzer.Application.DTOs.AI;
using ResumeAnalyzer.Application.DTOs.Request;
using ResumeAnalyzer.Application.DTOs.Response;
using ResumeAnalyzer.Application.DTOs.Resume;
using ResumeAnalyzer.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResumeAnalyzer.Application.Interfaces
{
    public interface IResumeService
    {
        Task<ResumeAnalysisResponse> AnalyzeResumeAsync(Stream stream,string fileName);
        Task<List<ResumeDto>> GetAllAsync();
        Task<Resume?> GetByIdAsync(Guid id);
        Task<ResumeDto> GetResumeByIdAsync(Guid id);
        Task DeleteAsync(Guid id);
        //Task<List<ResumeDto>> GetPagedAsync(ResumeQueryParameters query);
        Task<PagedResponse<ResumeDto>> GetPagedAsync(ResumeQueryParameters query);
        Task ProcessResumeAnalysisAsync(Guid resumeId);

        Task<Guid> UploadResumeAsync(Stream stream, string fileName);

        Task<JobMatchResult> MatchResumeWithJobAsync(Guid resumeId,string jobDescription);
    }
}
