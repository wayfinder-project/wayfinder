import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { ApiError } from '../../models/api-error.model';
import { UserRegistrationComponent } from '../user-registration/user-registration.component';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  @ViewChild(UserRegistrationComponent)
  registrationModal: UserRegistrationComponent;

  username = '';
  password = '';
  loginError?: string;

  // Registration form
  regUsername = '';
  regFirstName = '';
  regLastName = '';
  regEmail = '';
  regPassword = '';
  regPasswordConfirm = '';
  registrationError?: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() { }


  login() {
    this.authService
      .authenticate(this.username, this.password)
      .subscribe(() => {
        this.router.navigate(['home']);
      }, (err: ApiError) => {
        this.loginError = err.message;
      });
  }

  openRegistrationModal(): void {
    this.registrationModal.open();
  }

  registerNewUser(registrationData: { user: User, password: string }) {
    console.log(registrationData);
    this.userService.create(registrationData.user, registrationData.password).subscribe(user => {
      // User created successfully.
      this.authService
        .authenticate(user.username, registrationData.password)
        .subscribe(() => {
          this.router.navigate(['home']);
        });
    }, (err: ApiError) => {
      // Error in creating user.
      this.registrationError = err.message;
    });
  }

  register(): void {
    // Make sure passwords match (TODO: do more validation later).
    if (this.regPassword !== this.regPasswordConfirm) {
      this.registrationError = 'Passwords do not match.';
      return;
    }
    this.registrationError = '';
    const newUser = {
      username: this.regUsername,
      firstName: this.regFirstName,
      lastName: this.regLastName,
      email: this.regEmail,
    };
    this.userService.create(newUser, this.regPassword).subscribe(user => {
      // User created successfully.
      this.authService
        .authenticate(user.username, this.regPassword)
        .subscribe(() => {
          this.router.navigate(['home']);
        });
    }, (err: ApiError) => {
      // Error in creating user.
      this.registrationError = err.message;
    });
  }
}
