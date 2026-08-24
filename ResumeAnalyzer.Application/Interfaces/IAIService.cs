using ResumeAnalyzer.Application.DTOs.AI;
using ResumeAnalyzer.Application.DTOs.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResumeAnalyzer.Application.Interfaces
{
    public interface IAIService
    {
         Task<ResumeAnalysisResult> AnalyzeResumeAsync(string resumeText);

         Task<JobMatchResult> MatchResumeWithJobAsync(string resumeText,string jobDescription);
    }

    //Task<ResumeAnalysisResponse> AnalyzeResumeAsync(string resumeText);
    //Task<string> AnalyzeResumeAsync(string resumeText);
}
