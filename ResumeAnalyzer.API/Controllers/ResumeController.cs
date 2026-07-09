using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ResumeAnalyzer.Application.DTOs;
using ResumeAnalyzer.Application.DTOs.Resume;
using ResumeAnalyzer.Application.Interfaces;

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
            var result = await _resumeService.AnalyzeResumeAsync(request.File.OpenReadStream(),request.File.FileName);

            return Ok(result);
        }

        [HttpGet("GetAllResume")]
        public async Task<IActionResult> GetAll()
        {
            var resumeList = await _resumeService.GetAllAsync();
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
