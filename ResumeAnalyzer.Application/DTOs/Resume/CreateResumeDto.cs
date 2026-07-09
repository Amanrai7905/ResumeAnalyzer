using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResumeAnalyzer.Application.DTOs.Resume
{
    public class CreateResumeDto
    {
        public IFormFile File { get; set; } = null!;
    }
}
