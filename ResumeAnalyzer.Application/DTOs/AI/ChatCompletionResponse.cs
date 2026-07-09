using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ResumeAnalyzer.Application.DTOs.AI
{
    public class ChatCompletionResponse
    {
        [JsonPropertyName("choices")]
        public List<Choice> choices { get; set; } = new();
    }

    public class Choice
    {
        [JsonPropertyName("message")]
        public MessageResponse message { get; set; } = new();
    }

    public class MessageResponse
    {
        [JsonPropertyName("content")]
        public string content { get; set; } = string.Empty;
    }
}
