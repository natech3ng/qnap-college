import { ToastrService } from 'ngx-toastr';
import { User } from '../../auth/_models/user.model';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UsersService } from '../../auth/_services/users.service';

@Injectable()
export class UsersResolver implements Resolve<User []> {
  constructor(
    private _usersService: UsersService,
    private _toastr: ToastrService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User []> | Promise<User []>| User[] {
    return this._usersService.all().catch(error => {
      // console.log(`Retrieval error:`, error);
      this._toastr.error('You are not authorized.');
      return Observable.of(null);
    });
  }
}
