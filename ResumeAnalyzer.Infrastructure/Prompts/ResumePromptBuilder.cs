using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResumeAnalyzer.Infrastructure.Prompts
{
    public static class ResumePromptBuilder
    {
        public static string Build(string resumeText)
        {
            return $@"
                You are an experienced ATS system and HR recruiter.
          
                Analyze the following resume.
                
                Rules:
                1. ResumeScore MUST be an integer between 0 and 100.
                2. AtsScore MUST be an integer between 0 and 100.
                3. Do NOT return scores from 0 to 10.
                4. Return ONLY raw JSON.
                5. Do NOT use markdown.
                6. Do NOT explain anything.
                
                Return exactly this JSON format:
                
                {{
                  ""resumeScore"": 85,
                  ""atsScore"": 82,
                  ""skills"": [],
                  ""missingSkills"": [],
                  ""summary"": """",
                  ""suggestions"": []
                }}
                
                Resume:
                
                {resumeText}
            ";
        }
    }
}
