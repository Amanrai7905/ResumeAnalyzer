using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ResumeAnalyzer.Application.DTOs.AI
{

    public class ChatCompletionRequest
    {
        [JsonPropertyName("model")]
        public string model { get; set; } = string.Empty;

        [JsonPropertyName("messages")]
        public List<ChatMessage> messages { get; set; } = new();
    }

    public class ChatMessage
    {
        [JsonPropertyName("role")]
        public string role { get; set; } = string.Empty;

        [JsonPropertyName("content")]
        public string content { get; set; } = string.Empty;
    }
}
