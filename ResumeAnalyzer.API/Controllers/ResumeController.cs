using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ResumeAnalyzer.Application.DTOs;
using ResumeAnalyzer.Application.DTOs.Resume;
using ResumeAnalyzer.Application.Interfaces;
using System.IO;

namespace ResumeAnalyzer.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ResumeController : ControllerBase
    {
        private readonly IResumeService _resumeService;

        public ResumeController(IResumeService resumeService)
        {
            _resumeService = resumeService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] ResumeUploadRequest request)
        {
            var resumeId = await _resumeService.UploadResumeAsync(request.File.OpenReadStream(), request.File.FileName);

            return Ok(new
            {
                ResumeId = resumeId,
                Message = "Resume uploaded successfully. Analysis started in background."
            });
        }

        [HttpGet("GetAllResume")]
        public async Task<IActionResult> GetAll()
        {
            var resumeList = await _resumeService.GetAllAsync();
            if (resumeList == null)
                return NotFound();

            return Ok(resumeList);
        }

        [HttpGet("GetById{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var resume = await _resumeService.GetByIdAsync(id);

            if (resume == null)
                return NotFound();

            return Ok(resume);
        }

        [HttpGet("GetResumeById{id}")]
        public async Task<IActionResult> GetResume(Guid id)
        {
            var result = await _resumeService.GetResumeByIdAsync(id);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpDelete("Delete{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _resumeService.DeleteAsync(id);

            return NoContent();
        }

        [HttpGet("Paged")]
        public async Task<IActionResult> GetPaged([FromQuery] ResumeQueryParameters query)
        {
            var resumes = await _resumeService.GetPagedAsync(query);

            return Ok(resumes);
        }

    }
}
