import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
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
    private router: Router
  ) {}

  ngOnInit() {}

  login() {
    this.authService
      .authenticate(this.username, this.password)
      .subscribe(() => {
        this.router.navigate(['home']);
      });
  }
}
