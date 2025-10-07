using System.ComponentModel.DataAnnotations;

namespace ChatApp.Api.Models
{
    public class ChatMessage
    {
        public int Id { get; set; }
        [Required]
        public string User { get; set; }
        [Required]
        [MaxLength(150)]
        public string Message { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}