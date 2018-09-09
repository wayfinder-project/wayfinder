import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.css'],
})
export class UserpageComponent implements OnInit {
  // User information
  user: User;

  // Password
  password: string;
  inputPassword1: string;
  inputPassword2: string;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  update() {
    this.userService.update(this.user).subscribe(_ => {
      alert('Update successful!');
    });
  }

  updatePassword() {
    const toConfirm = prompt(
      'Are you sure you want to change your password? \n Enter CONFIRM if so.'
    );
    if (toConfirm === 'CONFIRM') {
      if (this.inputPassword1 !== this.inputPassword2) {
        alert('New passwords do not match.');
      } else {
        // this.authService.checkLogin(this.password).subscribe(
        //   t => {
        //     if (t != null) {
        //       this.data.updateUserPassword(this.inputPassword1).subscribe(
        //         v => {
        //           if (v != null) {
        //             this.password = "";
        //             this.inputPassword1 = "";
        //             this.inputPassword2 = "";
        //             alert("Password updated!");
        //           }
        //         }
        //       )
        //     }
        //     else {
        //       alert("Incorrect Password.");
        //     }
        //   }
        // );
      }
    }
  }
}

// Testing for git
