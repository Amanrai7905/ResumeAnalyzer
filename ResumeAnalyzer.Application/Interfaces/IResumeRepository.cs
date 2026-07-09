using ResumeAnalyzer.Application.DTOs.Resume;
using ResumeAnalyzer.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResumeAnalyzer.Application.Interfaces
{
    public interface IResumeRepository : IGenericRepository<Resume>
    {
        //Task<List<Resume>> GetPagedAsync(ResumeQueryParameters query);
        Task<(List<Resume> Items, int TotalCount)> GetPagedAsync(ResumeQueryParameters query);
    }
}
