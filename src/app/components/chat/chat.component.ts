import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  chatProfile: string = "";
  newMessage: string = "";
  messages: Array<string> = [];
  constructor(private route: ActivatedRoute, private service: SocketService) { }

  getChatProfile(): void {
    this.chatProfile = this.route.snapshot.paramMap.get('id');
  }

  sendMessage(): void {
    var timestamp = new Date().toString();
    var message = { from: window['globalUser'], to: this.chatProfile, timestamp: timestamp, message: this.newMessage };
    this.service.sendMessageToServer(message).subscribe((result) => {
      if (result["status"] == "success") {
        this.service.sendMessage(message);
        this.messages.push(this.newMessage);
      }
    });
  }

  getMessages(): void {
    this.service.getMessages(this.chatProfile, window['globalUser']).subscribe((result) => {
      if (result.length > 0) {
        result.forEach(res => {
          this.messages.push(res.message);
        });
      }
    });
  }

  ngOnInit() {
    this.getChatProfile();
    this.getMessages();
    this.service.receivedMessage.subscribe((message) => {
      if (message.length > 0) {
        this.messages.push(message);
      }
    });
  }
}
