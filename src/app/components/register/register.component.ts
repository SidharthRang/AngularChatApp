import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { User } from './../../classes/User';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user = new User();
  constructor(private userService: UserService, private location: Location) { }

  registerUser(): void {
    console.log(this.user);
    this.userService.addUser(this.user).subscribe(user_detail => {
      console.log(user_detail);
      this.location.back();
    });
  }
  ngOnInit() {
  }

}
