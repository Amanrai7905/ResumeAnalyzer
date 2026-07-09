using Microsoft.EntityFrameworkCore;
using ResumeAnalyzer.Application.DTOs.Resume;
using ResumeAnalyzer.Application.Interfaces;
using ResumeAnalyzer.Domain.Entities;
using ResumeAnalyzer.Infrastructure.Data;

namespace ResumeAnalyzer.Infrastructure.Repositories;

public class ResumeRepository : GenericRepository<Resume>, IResumeRepository
{
    private readonly AppDbContext _dbcontext;
    public ResumeRepository(AppDbContext context) : base(context)
    {
        _dbcontext = context;
    }
    public override async Task<List<Resume>> GetAllAsync()
    {
        return await _context.Resumes.OrderByDescending(r => r.UploadedAt).ToListAsync();
    }

    public async Task<Resume?> GetByIdAsync(Guid? id)
    {
        return await _context.Resumes.FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<(List<Resume> Items, int TotalCount)> GetPagedAsync(ResumeQueryParameters query)
    {
        IQueryable<Resume> resumes = _context.Resumes.AsQueryable();


        // Search
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            resumes = resumes.Where(r =>r.FileName.Contains(query.Search) ||r.Summary.Contains(query.Search));
        }

        // Sorting
        resumes = query.SortBy.ToLower() switch
        {
            "filename" => query.SortOrder.ToLower() == "asc"
                ? resumes.OrderBy(r => r.FileName)
                : resumes.OrderByDescending(r => r.FileName),

            "resumescore" => query.SortOrder.ToLower() == "asc"
                ? resumes.OrderBy(r => r.ResumeScore)
                : resumes.OrderByDescending(r => r.ResumeScore),

            _ => query.SortOrder.ToLower() == "asc"
                ? resumes.OrderBy(r => r.UploadedAt)
                : resumes.OrderByDescending(r => r.UploadedAt)
        };

        var totalCount = await resumes.CountAsync();
        resumes = resumes.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize);
        var items = await resumes.ToListAsync();

        //return await resumes.ToListAsync();
        return (items, totalCount);
    }


}