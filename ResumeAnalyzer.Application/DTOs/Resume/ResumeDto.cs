using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResumeAnalyzer.Application.DTOs.Resume
{
    public class ResumeDto
    {
        public Guid Id { get; set; }

        public string FileName { get; set; } = string.Empty;

        public int ResumeScore { get; set; }

        public int AtsScore { get; set; }

        public string Summary { get; set; } = string.Empty;

        public DateTime UploadedAt { get; set; }
    }
}
