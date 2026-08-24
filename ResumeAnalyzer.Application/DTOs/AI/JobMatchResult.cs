using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResumeAnalyzer.Application.DTOs.AI
{
    public class JobMatchResult
    {
        public int MatchScore { get; set; }

        public List<string> MatchedSkills { get; set; } = new();

        public List<string> MissingSkills { get; set; } = new();

        public List<string> Recommendations { get; set; } = new();
    }
}
