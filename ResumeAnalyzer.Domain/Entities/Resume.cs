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

        public int ResumeScore { get; set; }

        public int AtsScore { get; set; }

        public string Summary { get; set; } = string.Empty;

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    }
}
