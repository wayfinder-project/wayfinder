import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { TokenStorage } from '../../utils/token.storage';
import { environment } from '../../../environments/environment';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private userService: UserService,
    private tokenStorage: TokenStorage
  ) {}

  authenticate(username: string, password: string) {
    const credentials = { username, password };
    return this.http
      .post<string>(environment.apiUrl + '/login', credentials)
      .pipe(
        map<string, void>(token => {
          this.tokenStorage.saveToken(token);
          return null;
        })
      );
  }

  logout() {
    // Make sure we invalidate the currently cached user data in the
    // UserService.
    this.userService.invalidateCurrentUser();
    this.tokenStorage.signOut();
  }
}
