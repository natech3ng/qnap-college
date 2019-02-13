import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from '../../_services/confirm.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-forget-password',
  templateUrl: './forget.password.component.html',
  styleUrls: ['../auth.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  error: boolean = false;
  errMsg: string = "";
  signing: boolean = false;
  loading: boolean = false;
  sub: Subscription;
  seed = 'randomSeeds';
  tuid = '';
  token = '';
  aFormGroup: FormGroup;
  email = null;
  public readonly siteKey = environment.recaptchaV2Sitekey;

  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'en';
  public type: 'image' | 'audio';
  public badge: 'bottomright' | 'bottomleft' | 'inline' = 'bottomleft';

  constructor(
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _confirmService: ConfirmService,
    private _toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {
    this.sub = this._route.queryParams.subscribe(params => {
      this.seed = params['seed'];
    });
  }
  ngOnInit() {
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required],
      email: ['', Validators.email]
    });
    this._authService.prepareForgetPassword(this.seed).subscribe(
      (res) => {
        this.token = res.payload['token'];
        this.tuid = res.payload['tuid'];
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onSubmit(f: NgForm) {
    this._confirmService.open("Send the reset email link?").then(
      () => {
        console.log(f.value);
        this._authService.postForgetPassword(this.tuid, this.token, f.value.email).subscribe(
          (res) => {
            if (res.success)
              this._toastr.success("Please check your email box for the reset email");
            else {
              this._toastr.error(res.message);
            }
          },
          (err) => {
            this._toastr.error(err.message);
          }
        );
      }
    ).catch(() => {})
  }

  handleSuccess(captchaResponse: string): void {
    this.captchaSuccess = true;
    this.captchaResponse = captchaResponse;
    this.captchaIsExpired = false;
  }

  handleLoad(): void {
    this.captchaIsLoaded = true;
    this.captchaIsExpired = false;
  }

  handleExpire(): void {
    this.captchaSuccess = false;
    this.captchaIsExpired = true;
  }
  handleReady():void {
    console.log('handle ready');
  }
  handleReset(): void {
    this.captchaSuccess = false;
    this.captchaResponse = undefined;
    this.captchaIsExpired = false;
  }
}
