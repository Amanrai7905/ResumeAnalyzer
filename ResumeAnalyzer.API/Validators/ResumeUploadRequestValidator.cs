using FluentValidation;
using ResumeAnalyzer.Application.DTOs;

namespace ResumeAnalyzer.API.Validators
{
    public class ResumeUploadRequestValidator: AbstractValidator<ResumeUploadRequest>
    {
        public ResumeUploadRequestValidator()
        {
            RuleFor(x => x.File)
                .NotNull()
                .WithMessage("Resume file is required.");

            When(x => x.File != null, () =>
            {
                RuleFor(x => x.File.Length)
                    .LessThanOrEqualTo(5 * 1024 * 1024)
                    .WithMessage("Maximum file size is 5 MB.");

                RuleFor(x => x.File.FileName)
                    .Must(name =>
                        Path.GetExtension(name)
                            .Equals(".pdf", StringComparison.OrdinalIgnoreCase))
                    .WithMessage("Only PDF files are allowed.");
            });
        }
    }
}
