using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResumeAnalyzer.Application.DTOs.Response
{
    public class ResumeAnalysisResponse
    {
        public int ResumeScore { get; set; }

        public int AtsScore { get; set; }
        public string Summary { get; set; } = string.Empty;
        public List<string> Skills { get; set; } = new();

        public List<string> MissingSkills { get; set; } = new();

        public List<string> Suggestions { get; set; } = new();

        public string ResumeText { get; set; } = string.Empty;
    }
}
