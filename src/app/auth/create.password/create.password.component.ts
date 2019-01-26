
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as ResCode from '../../_codes/response';
import { AuthService } from '../_services/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ConfirmService } from '../../_services/confirm.service';
import { NgForm } from '@angular/forms';

@Component({
  templateUrl: './create.password.component.html',
  styleUrls: ['./create.password.component.scss']
})

export class CreatePasswordComponent implements OnInit, AfterViewInit, OnDestroy {
  
  @ViewChild('alertBox', {read: ElementRef}) alertBox: ElementRef;

  valid: boolean = false;
  private token: string = null;
  private uid: string;
  private sub: Subscription;
  private routeSub: Subscription;
  private creating: boolean = false;
  createError: boolean = false;
  createErrorMsg: string = null;

  constructor(
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _confirmService: ConfirmService,
    private renderer: Renderer2
  ) {
    this.sub = this._route.params.subscribe(params => {
      console.log(params);
      this.uid = params['id'];
    });
      this.routeSub = this._route.queryParams.subscribe(params => {
        console.log(params);
        this.token = params['token'];
      });
    }
  ngOnInit() {
    this._authService.tmpVerify(this.token).subscribe(
      (data) => {

        if (data && data.success) {
          this.valid = true;
        } else {
          this.renderer.setStyle(this.alertBox.nativeElement, 'display', 'block');
          this.valid = false;
        }
        console.log(data);
      }, 
      (error) => {
        this.valid = false;
        console.log(error);
      });

      console.log(this.valid);
  }
  ngAfterViewInit() {
    
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.routeSub.unsubscribe();
  }

  resend() {
    this._authService.resendVerification(this.uid).subscribe(
      (res) => {
        this._confirmService.alert("Success!");
      },
      (err) => {
        this.createError = true;
        this.createErrorMsg = err;
      }
    );
  }

  onCreate(f: NgForm) {
    this.creating = true;
    this._authService.createPassword(this.uid, this.token, f.value.password).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
      }
    );
    // this.reCaptchaV3Service.execute(this.siteKey, 'login', (token) => {
    //   console.log('This is your token: ', token);
    // });
    // this._authService.login(f.value.email, f.value.password).subscribe(
    //   (user: User) => {
    //     // console.log(user);
    //     this._router.navigate([this.returnUrl]);
    //   },
    //   (error) => {
    //     this.signing = false;
    //     this.loginError = true;
    //     this.loginErrorMsg = error.error.message;
    //   }
    // );
  }
}
