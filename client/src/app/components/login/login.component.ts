import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { ApiError } from '../../models/api-error.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private username = '';
  private password = '';
  private loginError?: string;

  // Registration form
  private regUsername = '';
  private regFirstName = '';
  private regLastName = '';
  private regEmail = '';
  private regPassword = '';
  private regPasswordConfirm = '';
  private registrationError?: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {}

  login() {
    this.authService
      .authenticate(this.username, this.password)
      .subscribe(() => {
        this.router.navigate(['home']);
      }, (err: ApiError) => {
        this.loginError = err.message;
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
