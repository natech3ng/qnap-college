import { AuthService } from './../_services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _authService: AuthService) {
  }

  private getUrlParameter(url, name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(url);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | boolean {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    console.log(currentUser);
    return this._authService.verify().map(
      data => {
        console.log('data');
        console.log(data);
        if (data !== null && data.success) {
          // logged in so return true
          this._authService.loggedIn = true;
          return true;
        } else {
          // error when verify so redirect to login page with the return url
          this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }
      },
      error => {
        console.log(error);
        // error when verify so redirect to login page with the return url
        this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      });
  }
}
