using ResumeAnalyzer.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResumeAnalyzer.Domain.Entities
{
    public class Resume : BaseEntity
    {
        public string FileName { get; set; } = string.Empty;

        public string ResumeText { get; set; } = string.Empty;

        public string AnalysisResult { get; set; } = string.Empty;

        public string FilePath { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending";

        public int ResumeScore { get; set; }

        public int AtsScore { get; set; }

        public string Summary { get; set; } = string.Empty;
        public string Skills { get; set; } = "[]";
        public string MissingSkills { get; set; } = "[]";
        public string Suggestions { get; set; } = "[]";

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    }
}
