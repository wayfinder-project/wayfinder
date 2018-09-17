import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { TokenStorage } from '../../utils/token.storage';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private username: string;
  private password: string;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private tokenStorage: TokenStorage,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.create(
      {
        username: 'ianprime0509',
        firstName: 'Ian',
        lastName: 'Ian',
        email: 'ianprime0509@gmail.com',
      },
      'password'
    ).subscribe(user => console.log('Created user!', user));
  }

  login() {
    this.authService
      .authenticate(this.username, this.password)
      .subscribe(data => {
        this.tokenStorage.saveToken(data.token);
        // data package can have user object, we can save user object in localStorage also, if we need to see its details
        this.router.navigate(['home']);
      });
  }
}
