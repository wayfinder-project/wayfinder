import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';
import { Trip } from '../../models/trip.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  /**
   * The currently logged-in user (cached from calls to getCurrentUser).
   */
  private currentUser?: User;

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(environment.apiUrl + '/users');
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(environment.apiUrl + `/users/${id}`);
  }

  getByUsername(username: string): Observable<User> {
    return this.http.get<User>(environment.apiUrl + '/users', {
      params: { username },
    });
  }

  /**
   * Gets the currently logged-in user.
   */
  getCurrentUser(): Observable<User> {
    // We cache the current user in a local variable to prevent making too many
    // calls to the database.
    return this.currentUser
      ? of(this.currentUser)
      : this.http
          .get<User>(environment.apiUrl + '/login')
          .pipe(tap(user => (this.currentUser = user)));
  }

  /**
   * Creates a new user with the given data and password.
   *
   * @param user the user data object, with the ID and trips fields optional
   * @param password the new user's password
   */
  create(
    user: Overwrite<User, { id?: number; trips?: Trip[] }>,
    password: string
  ): Observable<User> {
    // The server requires the trips property to be non-null, so we provide a
    // default empty array.
    if (!user.trips) {
      user.trips = [];
    }
    return this.http.post<User>(environment.apiUrl + '/users', {
      user,
      password,
    });
  }

  /**
   * Invalidates the cached data for the current user, forcing the next call to
   * getCurrentUser to contact the server for new data.
   */
  invalidateCurrentUser(): void {
    this.currentUser = undefined;
  }

  /**
   * Updates the given user.
   *
   * @param user the user to update
   */
  update(user: User): Observable<User> {
    return this.http
      .put<User>(environment.apiUrl + `/users/${user.id}`, user)
      .pipe(
        tap(updated => {
          // We need to make sure that we refresh the current user if that's the
          // one that was updated.
          if (this.currentUser && this.currentUser.id === updated.id) {
            this.currentUser = updated;
          }
        })
      );
  }
}
