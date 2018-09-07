import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { TokenStorage } from '../../utils/token.storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private username: string;
  private password: string;

  constructor(private authService: AuthService, private tokenStorage: TokenStorage, private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.authService.authenticate(this.username, this.password).subscribe(data => {
      this.tokenStorage.saveToken(data.token);
      // data package can have user object, we can save user object in localStorage also, if we need to see its details
      this.router.navigate(['home']);
    });
  }
}
