import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user.model';

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
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {}

  login() {
    this.authService
      .authenticate(this.username, this.password)
      .subscribe(() => {
        let u: User;
        this.userService.getByUsername(this.username).subscribe(
          t => {
            u = t;
          }
        );
        this.userService.setCurrentUser(u);
        this.router.navigate(['home']);
      });
  }
}
