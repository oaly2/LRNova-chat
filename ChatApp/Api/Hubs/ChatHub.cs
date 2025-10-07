using ChatApp.Api.Data;
using ChatApp.Api.Models;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Api.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _context;

        // Inject the DbContext via the constructor
        public ChatHub(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task SendMessage(string user, string message)
        {
            // Create a new ChatMessage object
            var chatMessage = new ChatMessage
            {
                User = user,
                Message = message,
                Timestamp = DateTime.UtcNow
            };

            // Save the message to the database
            _context.ChatMessages.Add(chatMessage);
            await _context.SaveChangesAsync();

            // Broadcast the message to all clients
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}