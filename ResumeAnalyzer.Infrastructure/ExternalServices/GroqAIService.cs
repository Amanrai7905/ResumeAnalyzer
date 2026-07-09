using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Options;
using ResumeAnalyzer.Application.DTOs.AI;
using ResumeAnalyzer.Application.Interfaces;
using ResumeAnalyzer.Infrastructure.Configuration;
using ResumeAnalyzer.Infrastructure.Prompts;

namespace ResumeAnalyzer.Infrastructure.ExternalServices;

public class GroqAIService : IAIService
{
    private readonly HttpClient _httpClient;
    private readonly GroqOptions _options;

    public GroqAIService(HttpClient httpClient, IOptions<GroqOptions> options)
    {
        _httpClient = httpClient;
        _options = options.Value;
    }

    public async Task<ResumeAnalysisResult> AnalyzeResumeAsync(string resumeText)
    {
        _httpClient.BaseAddress = new Uri(_options.BaseUrl);

        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _options.ApiKey);

        var request = new ChatCompletionRequest
        {
            model = _options.Model,
            messages = new List<ChatMessage>
            {
                new()
                {
                    role = "user",
                    content = ResumePromptBuilder.Build(resumeText)
                }
            }
        };

        var response = await _httpClient.PostAsJsonAsync("chat/completions", request);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();

            throw new Exception(
                $"Status Code: {(int)response.StatusCode}\n" +
                $"Reason: {response.ReasonPhrase}\n" +
                $"Response: {error}");
        }

        var chatResponse = await response.Content.ReadFromJsonAsync<ChatCompletionResponse>();

        if (chatResponse == null || chatResponse.choices.Count == 0)
        {
            throw new Exception("No response received from Groq.");
        }

        var json = CleanJsonResponse(chatResponse.choices[0].message.content);

        var result = JsonSerializer.Deserialize<ResumeAnalysisResult>(json,new JsonSerializerOptions{PropertyNameCaseInsensitive = true});

        if (result == null)
        {
            throw new Exception("Unable to parse AI response.");
        }

        return result;
    }

    private static string CleanJsonResponse(string response)
    {
        if (string.IsNullOrWhiteSpace(response))
            return response;

        response = response.Trim();

        if (response.StartsWith("```json", StringComparison.OrdinalIgnoreCase))
        {
            response = response.Substring(7).Trim();
        }
        else if (response.StartsWith("```"))
        {
            response = response.Substring(3).Trim();
        }

        if (response.EndsWith("```"))
        {
            response = response.Substring(0, response.Length - 3).Trim();
        }

        return response;
    }

}