using ResumeAnalyzer.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UglyToad.PdfPig;

namespace ResumeAnalyzer.Infrastructure.ExternalServices
{
    public class PdfService : IPdfService
    {
        public async Task<string> ExtractTextAsync(string filePath)
        {
            var text = new StringBuilder();

            using (PdfDocument document = PdfDocument.Open(filePath))
            {
                foreach (var page in document.GetPages())
                {
                    text.AppendLine(page.Text);
                }
            }

            return await Task.FromResult(text.ToString());
        }
    }
}
