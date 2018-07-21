import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userName: string = "";
  password: string = "";
  constructor(private router: Router, private userService: UserService) { }

  login(): void {
    this.userService.checkUser({ userName: this.userName, password: this.password }).subscribe((user) => {
      if (user['status'] == 'success') {
        this.userService.userInfo = user['result'];
        this.router.navigateByUrl('/dashboard');
      } else {
        alert('No Such User');
      }
    });
  }

  ngOnInit() {
  }

}
