using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ResumeAnalyzer.Application.DTOs;
using ResumeAnalyzer.Application.Interfaces;

namespace ResumeAnalyzer.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public EmailController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("send-test")]
        public async Task<IActionResult> SendTestEmail()
        {
            await _emailService.SendEmailAsync(new EmailRequest
            {
                To = "yourgmail@gmail.com",
                Subject = "Test Email",
                Body = "<h2>Hello Aman!</h2><p>Email service is working successfully.</p>"
            });

            return Ok("Email sent successfully.");
        }
    }
}
