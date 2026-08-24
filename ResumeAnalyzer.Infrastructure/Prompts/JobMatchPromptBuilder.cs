using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResumeAnalyzer.Infrastructure.Prompts
{
    public static class JobMatchPromptBuilder
    {
        public static string Build(string resumeText,string jobDescription)
        {
            return $@"
                 You are an expert technical recruiter and ATS analyzer.

                 Analyze how well the following resume matches
                 the provided job description.

                RESUME:
                    {resumeText}

               JOB DESCRIPTION:
                  {jobDescription}

               Evaluate the resume against the job description.

               Return ONLY valid JSON.

               Do not use markdown.
               Do not use ```json.
               Do not add explanations outside JSON.

               The JSON must follow exactly this structure:
              {{
                ""matchScore"": 0,
                ""matchedSkills"": [],
                ""missingSkills"": [],
                ""recommendations"": []
              }}

               Rules:

               1. matchScore must be between 0 and 100.

               2. matchedSkills should contain skills,
                  technologies, tools, or requirements
                  present in both the resume and job description.

               3. missingSkills should contain important
                  skills or requirements from the job description
                  that are missing from the resume.

              4. recommendations should contain practical
                 suggestions for improving the resume for this
                 specific job.

              5. Do not invent experience that is not present
                in the resume.
        ";
        }
    }
}