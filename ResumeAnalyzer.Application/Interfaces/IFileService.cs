using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResumeAnalyzer.Application.Interfaces
{
    public interface IFileService
    {
        Task<string> SaveFileAsync(Stream stream, string fileName);
        Task DeleteFileAsync(string filePath);
    }
}
