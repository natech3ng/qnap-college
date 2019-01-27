import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user.model';

@Injectable()
export class UsersService {

  apiRoot: string = environment.apiUrl;

  constructor(
    private _authService: AuthService,
    private _httpClient: HttpClient) {}

  create(user: User) {
    const body = JSON.stringify(user);
    const api_query = this.apiRoot + 'user';
    return this._httpClient.post<User []>(api_query, body, this._authService.jwtHttpClient());
  }

  delete(id: string) {
    const api_query = this.apiRoot + `user/${id}`;
    return this._httpClient.delete<User []>(api_query, this._authService.jwtHttpClient());
  }

  all(): Observable<User []> {
    const api_query = this.apiRoot + 'users';
    return this._httpClient.get<User []>(api_query, this._authService.jwtHttpClient());
  }
}
