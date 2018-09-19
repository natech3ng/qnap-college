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

  create() {
  }

  delete() {
  }

  all(): Observable<User []> {
    const api_query = this.apiRoot + 'users';
    return this._httpClient.get<User []>(api_query, this._authService.jwtHttpClient());
  }
}
