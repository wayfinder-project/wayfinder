import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
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

  create(
    user: Overwrite<User, { id?: number }>,
    password: string
  ): Observable<User> {
    console.log('Creating user');
    return this.http.post<User>(environment.apiUrl + '/users', {
      user,
      password,
    });
  }

  /**
   * Updates the given user.
   *
   * @param user the user to update
   */
  update(user: User): Observable<User> {
    return this.http.patch<User>(environment.apiUrl + '/users/', user);
  }
}
