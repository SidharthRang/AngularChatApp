import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  contacts: string[];
  constructor(private socketService: SocketService, private userService: UserService) {
  }

  getUsers(): void {
    this.userService.getUsers().subscribe((result) => {
      this.contacts = result["users"].filter(user => {
        return user != window['globalUser'];
      });
    })
  }

  ngOnInit() {
    this.getUsers();
    this.socketService.notifyOthers({ user: window['globalUser'] });
    this.socketService.receivedMessage.subscribe((message) => {
      if (message.length > 0) {
        console.log(message);
      }
    });
  }
}
