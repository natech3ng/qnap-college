import { User } from '../../auth/_models/user.model';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UsersService } from '../../auth/_services/users.service';

@Injectable()
export class UsersResolver implements Resolve<User []> {
  constructor(private _usersService: UsersService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User []> | Promise<User []>| User[] {
    return this._usersService.all();
  }
}
