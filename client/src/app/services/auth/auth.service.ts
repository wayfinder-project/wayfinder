import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { TokenStorage } from '../../utils/token.storage';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private authUrl = 'http://localhost:8888/token/generate-token';

  constructor(private http: HttpClient, private tokenStorage: TokenStorage) { }

  authenticate(ussername: string, password: string) {
    const credentials = { username: ussername, password: password };
    return this.http.post<any>(this.authUrl, credentials);
  }

  logout() {
    this.tokenStorage.signOut();
  }
}
