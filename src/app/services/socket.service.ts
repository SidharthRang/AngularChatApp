import { Injectable } from '@angular/core';
import * as io from "socket.io-client";
import { Subject } from 'rxjs/Subject';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SocketService {
  private socket: SocketIOClient.Socket
  constructor(private http: HttpClient) {
    this.socket = io();
    this.init();
  }
  private checkMessages = new Subject<string>();
  receivedMessage = this.checkMessages.asObservable();

  notifyOthers(my_id) {
    this.socket.emit('alertFriends', my_id);
  }

  sendMessageToServer(message: object): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<Object>('/sendMessage', message, httpOptions);
  }

  sendMessage(message: object) {
    this.socket.emit('sendMessage', message)
  }

  receiveMessage(message: string) {
    this.checkMessages.next(message);
  }

  getMessages(from: string, to: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.get<Object>(`/getMessages?from=${from}&to=${to}`, httpOptions);
  }

  init() {
    this.socket.on('loginAlert', (user) => {
      console.log(user.user + ' is online');
    });

    this.socket.on('chatRequest', (user) => {
      console.log(user.user + ' wants to chat with you');
    });

    this.socket.on('receiveMessage', (message) => {
      this.receiveMessage(message.message);
    });
  }

}
