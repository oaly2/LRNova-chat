using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Api.Hubs
{
    public class ChatHub : Hub
    {
        // This method can be called by a connected client.
        public async Task SendMessage(string user, string message)
        {
            // This sends the received message to all connected clients.
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}