import { Component, OnInit } from '@angular/core';
import { User } from '../../../auth/_models/user.model';
import { NgForm } from '@angular/forms';
import { ConfirmService } from '../../../_services/confirm.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-new',
  templateUrl: '../shared/user-new.component.html',
  styleUrls: ['./user-new.component.scss']
})
export class UserNewComponent implements OnInit {

  app = 'Add User';
  user: User;
  constructor(
    private _confirmService: ConfirmService,
    private _toastr: ToastrService
  ) {
    this.user = new User();
  }

  ngOnInit() {
  }

  onSubmit(f: NgForm) {
    this._confirmService.open('Do you want to submit?').then(
      () => {
      }).catch( () => {
        // Reject
        // this._toastr.error('Failed to add a course');
    });
  }

}
