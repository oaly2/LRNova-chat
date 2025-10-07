import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

// Define a simple interface for our message structure
export interface ChatMessage {
  user: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection: signalR.HubConnection;
  
  // Use a BehaviorSubject to store and stream messages to components
  public messages$ = new BehaviorSubject<ChatMessage[]>([]);

  constructor() {
    // Initialize the HubConnection
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5179/chathub')
      .build();
  }

  // Call this method to start the connection and listen for messages
  public startConnection = () => {
    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
        this.addReceiveMessageListener();
      })
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  // Method to invoke the 'SendMessage' on the hub
  public sendMessage = (user: string, message: string) => {
    this.hubConnection
      .invoke('SendMessage', user, message)
      .catch(err => console.error(err));
  }

  // Private method to set up the listener for 'ReceiveMessage'
  private addReceiveMessageListener = () => {
    this.hubConnection.on('ReceiveMessage', (user: string, message: string) => {
      const currentMessages = this.messages$.getValue();
      const updatedMessages = [...currentMessages, { user, message }];
      this.messages$.next(updatedMessages);
    });
  }
}