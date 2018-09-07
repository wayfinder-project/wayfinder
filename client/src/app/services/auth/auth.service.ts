import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { TokenStorage } from '../../utils/token.storage';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private tokenStorage: TokenStorage) {}

  authenticate(username: string, password: string) {
    const credentials = { username, password };
    return this.http.post<any>(environment.apiUrl + '/login', credentials);
  }

  logout() {
    this.tokenStorage.signOut();
  }
}
