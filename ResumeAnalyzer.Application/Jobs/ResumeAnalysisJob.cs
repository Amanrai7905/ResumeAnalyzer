using ResumeAnalyzer.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResumeAnalyzer.Application.Jobs
{
    public class ResumeAnalysisJob
    {
        private readonly IResumeService _resumeService;

        public ResumeAnalysisJob(IResumeService resumeService)
        {
            _resumeService = resumeService;
        }

        public async Task AnalyzeResumeAsync(Guid resumeId)
        {
            await _resumeService.ProcessResumeAnalysisAsync(resumeId);
        }
    }
}
