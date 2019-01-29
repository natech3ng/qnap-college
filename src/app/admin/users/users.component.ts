import { ToastrService } from 'ngx-toastr';
import { ConfirmService } from './../../_services/confirm.service';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../auth/_models/user.model';
import { UsersService } from '../../auth/_services/users.service';
import Role from '../../_models/role';
import { RoleService } from '../../_services/role.service';
import { EventBrokerService } from '../../_services/event.broker.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  app = 'Users';
  sub: Subscription;
  users: User [];
  roles: Role [];
  @Output() loading: EventEmitter<any> = new EventEmitter();

  checkb = '<i class="fa fa-check"></i>';
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _confirmService: ConfirmService,
    private _toastr: ToastrService,
    private _usersService: UsersService,
    private _roleService: RoleService,
    private _eventBroker: EventBrokerService) { }

  ngOnInit() {
    this.sub = this._route.data.subscribe(
      (data: Data) => {
        if (data.users) {
          this.users = data.users;
        }
      });
    
    this._roleService.all().subscribe(
      (roles) => {
        this.roles = roles;
      },
      (error) => {
        console.log(error);
      }
    )
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

  onSetRole(uid: string, roleName: string) {
    this.loading.emit(null);
    this._eventBroker.emit<boolean>("loading", true);
    this._usersService.setRole(uid, roleName).subscribe(
      (res: any) => {
        this._usersService.all().subscribe(
          (users) => {
            this.users = users;
            this._eventBroker.emit<boolean>("loading", false);
          },
          (err) => {
            this._toastr.error("Failed to pull users data");
            this._eventBroker.emit<boolean>("loading", false);
          }
        );
      },
      (err: any) => {
        console.log(err);
        this._eventBroker.emit<boolean>("loading", false);
      }
    );
  }
}
