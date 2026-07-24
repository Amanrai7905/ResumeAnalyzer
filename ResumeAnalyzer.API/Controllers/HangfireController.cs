using Hangfire;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ResumeAnalyzer.Application.Jobs;

namespace ResumeAnalyzer.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HangfireController : ControllerBase
    {
        private readonly IBackgroundJobClient _backgroundJobClient;

        public HangfireController(IBackgroundJobClient backgroundJobClient)
        {
            _backgroundJobClient = backgroundJobClient;
        }

        [HttpPost("fire-and-forget")]
        public IActionResult FireAndForget()
        {
            _backgroundJobClient.Enqueue<SampleJob>(job => job.SayHello());

            return Ok("Background job created successfully.");
        }
    }
}
