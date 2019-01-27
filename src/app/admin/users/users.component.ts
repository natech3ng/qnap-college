import { ToastrService } from 'ngx-toastr';
import { ConfirmService } from './../../_services/confirm.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../auth/_models/user.model';
import { UsersService } from '../../auth/_services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  app = 'Users';
  sub: Subscription;
  users: User [];

  checkb = '<i class="fa fa-check"></i>';
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _confirmService: ConfirmService,
    private _toastr: ToastrService,
    private _usersService: UsersService) { }

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

  onDelete(user: User) {
    this._confirmService.open('Do you want to submit?').then(
      () => {
        this._usersService.delete(user._id).subscribe(
        (res: any) => {
          this._toastr.success("Successfully delete a user");
          this._router.navigate(['/admin/users']);
          this._usersService.all().subscribe(
            (users) => {
              this.users = users;
            },
            (err) => {
              this._toastr.error("Failed to pull users data");
            }
          );
        }, (err: any) => {
          console.log(err.error.message);
          this._toastr.error("Failed to delete a user");
        });
      }).catch( () => {
        // Reject
        this._toastr.error('Failed to add a user');
    });
  }

}
