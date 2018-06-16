import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../auth/_models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  app = 'Users';
  sub: Subscription;
  users: User [];
  constructor(private _route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this._route.data.subscribe(
      (data: Data) => {
        if (data.users) {
          this.users = data.users;
        }
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
