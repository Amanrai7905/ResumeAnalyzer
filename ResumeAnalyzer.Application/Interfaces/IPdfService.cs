using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResumeAnalyzer.Application.Interfaces
{
    public interface IPdfService
    {
        Task<string> ExtractTextAsync(string filePath);
    }
}
