import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

export interface ChatMessage {
  user: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection: signalR.HubConnection;
  
  public messages$ = new BehaviorSubject<ChatMessage[]>([]);
  // --- NEW: A subject to track the connection state ---
  public connectionState$ = new BehaviorSubject<string>('Disconnected');

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7167/chathub') 
      .build();

    this.hubConnection.onclose(error => {
      console.error('Connection closed', error);
      this.connectionState$.next('Disconnected');
    });
  }

  public startConnection = () => {
    this.connectionState$.next('Connecting');
    console.log('Attempting to start connection...');

    this.hubConnection
      .start()
      .then(() => {
        this.connectionState$.next('Connected');
        console.log('Connection successful!');
        this.addReceiveMessageListener();
      })
      .catch(err => {
        console.error('Connection failed: ', err);
        this.connectionState$.next('Error');
      });
  }

  public sendMessage = (user: string, message: string) => {
    this.hubConnection
      .invoke('SendMessage', user, message)
      .catch(err => console.error(err));
  }

  private addReceiveMessageListener = () => {
    this.hubConnection.on('ReceiveMessage', (user: string, message: string) => {
      const currentMessages = this.messages$.getValue();
      const updatedMessages = [...currentMessages, { user, message }];
      this.messages$.next(updatedMessages);
    });
  }
}