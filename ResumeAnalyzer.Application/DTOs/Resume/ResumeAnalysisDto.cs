using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResumeAnalyzer.Application.DTOs.Resume
{
    public class ResumeAnalysisDto
    {
        public int ResumeScore { get; set; }

        public int AtsScore { get; set; }

        public List<string> Skills { get; set; } = [];

        public List<string> MissingSkills { get; set; } = [];

        public List<string> Suggestions { get; set; } = [];

        public string Summary { get; set; } = string.Empty;
    }
}
