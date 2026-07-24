using ResumeAnalyzer.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResumeAnalyzer.Infrastructure.ExternalServices
{
    public class FileService : IFileService
    {
        public async Task<string> SaveFileAsync(Stream stream, string fileName)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(),"Uploads");

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = $"{Guid.NewGuid()}-{fileName}";

            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using var fileStream = new FileStream(filePath, FileMode.Create);

            await stream.CopyToAsync(fileStream);

            return filePath;
        }


    }
}
