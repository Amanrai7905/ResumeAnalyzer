using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResumeAnalyzer.Application.DTOs.JobMatching
{
    public class JobMatchRequest
    {
        public Guid ResumeId { get; set; }

        public string JobDescription { get; set; } = string.Empty;
    }
}
