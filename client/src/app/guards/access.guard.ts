import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Observable } from 'rxjs';
import { TokenStorage } from '../utils/token.storage';

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private tokenStorage: TokenStorage) { }

  // RouterStateSnapshot to cache the url attempted to be accessed on the auth service
  // after user logs in, use this url to direct them to the page they want
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const requiresLogin = route.data.requiresLogin || false;
    // const requiresAdmin = route.data.requiresAdmin || false;
    if (this.tokenStorage.getToken()) {
      return true;
    }
    return false;
  }
}
