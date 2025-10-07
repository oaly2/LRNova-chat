import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 1. Import FormsModule
import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule // 2. Add it here
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  user: string = '';
  message: string = '';

  // Inject the ChatService
  constructor(public chatService: ChatService) {}

  // Start the connection when the component loads
  ngOnInit(): void {
    this.chatService.startConnection();
  }

  // Send a message using the service
  sendMessage(): void {
    if (this.user && this.message) {
      this.chatService.sendMessage(this.user, this.message);
      this.message = ''; // Clear input after sending
    }
  }
}