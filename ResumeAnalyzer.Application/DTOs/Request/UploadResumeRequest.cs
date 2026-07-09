using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResumeAnalyzer.Application.DTOs.Request
{
    public class UploadResumeRequest
    {
        public IFormFile ResumeFile { get; set; } = default!;
    }
}
