import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from './../classes/User';

@Injectable()
export class UserService {

  userInfo: Object = {};

  constructor(private http: HttpClient) { }

  addUser(user: User): Observable<User> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<User>('/registerUser', user, httpOptions);
  }

  checkUser(user: Object): Observable<Object> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<Object>('/login', user, httpOptions);
  }

  deleteUser(id: string): any {
    const httpOptions = {
      headers: new HttpHeaders({ 'X-id': id })
    }
    return this.http.delete<any>('/deleteUser', httpOptions);
  }

  addProfileImage(id: string, data: FormData) {
    let headers = new HttpHeaders();
    headers = headers.append('X-auth', id);
    const httpOptions = {
      headers: headers
    };
    return this.http.put<any>('/updateProfilePic', data, httpOptions);
  }

  getUser(): Object {
    return this.userInfo;
  }

}

