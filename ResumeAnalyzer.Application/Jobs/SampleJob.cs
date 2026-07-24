using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResumeAnalyzer.Application.Jobs
{
    public class SampleJob
    {
        public void SayHello()
        {
            Console.WriteLine($"Hello from Hangfire! Time: {DateTime.Now}");
        }
    }
}
