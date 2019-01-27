import { AuthResponse, AuthResponseError } from './../../_models/authresponse';
import { User } from './../_models/user.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  Http,
  Response,
  Headers,
  RequestOptions  } from '@angular/http';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthService {
  private apiRoot = environment.apiUrl;
  private base_url = 'https://go.qnap.com/api';
  token: string;
  private _loggedIn;
  constructor(private httpClient: HttpClient) {
    this._loggedIn = false;
  }

  constructHeader() {
    const currUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = ( currUser && 'token' in currUser) ? currUser.token : this.token;
    const headers = new Headers({ 'x-access-token': token });
    return { headers: headers };
  }

  // fbLogin(user: User) {
  //   const body = JSON.stringify(user);
  //   const headers = new HttpHeaders({'Content-Type': 'application/json'});
  //   const options = {
  //     headers: headers
  //   };
  //   return this.http.post<AuthResponse>(`/api/fbLogin`, body, options)
  //     .map((response) => {
  //       // logger.debug(response);
  //       if (response.success === true) {

  //         const ruser = response.user;
  //         ruser.token = response.token;
  //         delete ruser['salt'];
  //         delete ruser['hash'];
  //         if (ruser && ruser.token) {
  //           // store user details and jwt token in local storage to keep user logged in between page refreshes
  //           localStorage.setItem('currentUser', JSON.stringify(ruser));
  //         }
  //         return ruser;
  //       }
  //     });
  // }
  verify(): Observable<AuthResponse | AuthResponseError> {
    return this.httpClient.get<AuthResponse | AuthResponseError>(this.apiRoot + 'check-state', this.jwtHttpClient()).catch((err: HttpErrorResponse) => {
      // console.error('An error occurred:', err.error);
      return Observable.of(err.error);
    });
  }
  tmpVerify(token): Observable<AuthResponse | AuthResponseError> {
    return this.httpClient.get<AuthResponse | AuthResponseError>(this.apiRoot + 'check-tmp-state?token=' + token, this.jwtHttpClient()).catch((err: HttpErrorResponse) => {
      // console.error('An error occurred:', err.error);
      return Observable.of(err.error);
    });
  }

  changePassword(email: string, oldPassword: string, password: string): Observable<AuthResponse | AuthResponseError> {
    const body = JSON.stringify({ email: email, password: password, oldPassword: oldPassword });
    return this.httpClient.post<AuthResponse | AuthResponseError>(this.apiRoot + 'change-password', body, this.jwtHttpClient()).catch((err: HttpErrorResponse) => {
      console.error('An error occurred:', err.error);
      return Observable.of(err.error);
    });
  }

  login(email: string, password: string): any {
    const body = JSON.stringify({ email: email, password: password });
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    const options = {
      headers: headers
    };

    return this.httpClient.post<AuthResponse>(`${this.apiRoot}login`, body, options)
      .map((response: AuthResponse) => {
        // login successful if there's a jwt token in the response
        if (response.success === true) {
          const user = response.user;
          user.token = response.token;
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            delete user['salt'];
            delete user['hash'];
            this._loggedIn = true;
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          return user;
        }
      });
  }

  logout() {
    // remove user from local storage to log user out
    this.token = null;
    this._loggedIn = false;
    localStorage.removeItem('currentUser');
  }

  setToken(res) {
    const body = JSON.parse(res['_body']);
    if (body['success'] === true) {
      this.token = body['token'];
      this._loggedIn = true;
      localStorage.setItem('currentUser', JSON.stringify({
        email: body['user']['email'],
        token: this.token
      }));
    }
    return body;
  }

  parseRes(res) {
    const body = JSON.parse(res['_body']);
    return body;
  }

  get loggedIn() {
    return this._loggedIn;
  }

  set loggedIn(value: boolean) {
    this._loggedIn = value;
  }

  verifyEmail(uid: string, token: string): Observable<{success: boolean, message: string}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<{success: boolean, message: string}>(`${this.apiRoot}user/verification/${uid}?token=${token}`, {}, { headers: headers });
  }

  resendVerification(uid: string): Observable<{success: boolean, message: string}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<{success: boolean, message: string}>(`${this.apiRoot}user/resend_verification/${uid}`, {}, { headers: headers });
  }

  createPassword(uid:string, token: string, password: string): Observable<{success: boolean, message: string}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({password: password});
    return this.httpClient.post<{success: boolean, message: string}>(`${this.apiRoot}user/create_password/${uid}?token=${token}`, body, { headers: headers });
  }


  jwtHttpClient() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(currentUser);
    if (currentUser && currentUser.token) {
      let headers = new HttpHeaders({ 'x-access-token': currentUser.token });
      headers = headers.append('Content-Type', 'application/json');
      return { headers: headers };
    }
  }

  jwtHttpClientHeader(): HttpHeaders {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let headers;
    if (currentUser && currentUser.token) {
      headers = new HttpHeaders({ 'x-access-token': currentUser.token });
      return headers;
    }
  }

}
