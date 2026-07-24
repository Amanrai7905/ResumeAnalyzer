using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using ResumeAnalyzer.Application.Configurations;
using ResumeAnalyzer.Application.DTOs;
using ResumeAnalyzer.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResumeAnalyzer.Infrastructure.ExternalServices
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;

        public EmailService(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }

        public async Task SendEmailAsync(EmailRequest request)
        {
            var email = new MimeMessage();

            email.From.Add(new MailboxAddress(_emailSettings.SenderName,_emailSettings.SenderEmail));

            email.To.Add(MailboxAddress.Parse(request.To));

            email.Subject = request.Subject;

            email.Body = new TextPart("html")
            {
                Text = request.Body
            };

            using var smtp = new SmtpClient();

            await smtp.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.Port,SecureSocketOptions.StartTls);

            await smtp.AuthenticateAsync(_emailSettings.SenderEmail,_emailSettings.Password);

            await smtp.SendAsync(email);

            await smtp.DisconnectAsync(true);
        }
    }
}
