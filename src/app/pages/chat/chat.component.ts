import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  messages: any[] = [];
  newMessage: string = '';
  currentUser: string = '';
  chatWith: string = '';
  private ws: WebSocket | undefined;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentUser = params['currentUser'];
      this.chatWith = params['chatWith'];
      this.initializeWebSocket();
      this.fetchMessages();
    });
  }

  initializeWebSocket() {
    this.ws = new WebSocket('ws://localhost:8000/ws/' + this.currentUser);
    this.ws.onopen = () => {
      console.log('WebSocket connection established');
    };
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.messages.push(message);
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed. Attempting to reconnect...');
      setTimeout(() => this.initializeWebSocket(), 5000);  // Wait for 5 seconds before attempting to reconnect
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket encountered an error:', error);
      this.ws?.close(); // Ensure the connection is closed before attempting to reconnect
    };

  }

  fetchMessages(): void {
    this.http.get(`http://localhost:8000/get-messages/?sender=${this.currentUser}&recipient=${this.chatWith}`)
      .subscribe({
        next: (response: any) => this.messages = response,
        error: (error) => console.error('Failed to fetch messages', error)
      });
  }

  sendMessage(): void {
    if (this.ws) {
      const messageData = { recipient: this.chatWith, message: this.newMessage };
      this.ws.send(JSON.stringify(messageData));

      this.messages.push({
        sender: this.currentUser,
        recipient: this.chatWith,
        message: this.newMessage,
        delivered: false // Set to false initially, can be updated when acknowledgment is received
      });

      this.newMessage = '';
    }
  }

  ngOnDestroy(): void { 
    if (this.ws) {
      this.ws.close();
    }
  }
       
}
