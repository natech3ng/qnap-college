import { Component } from '@angular/core';


@Component({
  selector: 'app-forget-password',
  templateUrl: './forget.password.component.html',
  styleUrls: ['../auth.component.scss']
})
export class ForgetPasswordComponent {
  error: boolean = false;
  errMsg: string = "";
  signing: boolean = false;
  loading: boolean = false;
}
