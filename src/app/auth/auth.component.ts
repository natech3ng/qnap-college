import { FacebookService, InitParams, LoginResponse } from 'ngx-facebook';
import { User } from './_models/user.model';
import { AuthService } from './_services/auth.service';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReCaptchaV3Service, ReCaptcha2Component } from 'ngx-captcha';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  signing: boolean = false;
  registering: boolean = false;
  returnUrl: string;
  signin: boolean;
  loginError = false;
  loginErrorMsg = '';
  regError = false;
  regErrorMsg = ''
  public readonly siteKey = environment.recapctchaSitekey;

  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'en';
  public type: 'image' | 'audio';
  public badge: 'bottomright' | 'bottomleft' | 'inline' = 'bottomleft';

  protected aFormGroup: FormGroup;

  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _authService: AuthService,
    private reCaptchaV3Service: ReCaptchaV3Service,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private _toastr: ToastrService, 
    private fb: FacebookService) {
      // console.log(this._route.snapshot.url[0].path);
      this._route.url.subscribe(
        (url) => {
          url[0].path === 'login' ? this.signin = true : this.signin = false;
        }
      );

      let initParams: InitParams = {
        appId: '482418502252290',
        xfbml: true,
        version: 'v2.8'
      };
  
      fb.init(initParams);
    }

  ngOnInit() {
    this.signing = false;
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/admin';
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    this.signing = false;
  }

  onSignin(f: NgForm) {
    this.signing = true;
    // this.reCaptchaV3Service.execute(this.siteKey, 'login', (token) => {
    //   console.log('This is your token: ', token);
    // });

    this._authService.login(f.value.email, f.value.password).subscribe(
      (user: User) => {
        // console.log(user);
        if (user.role === 'normal') {
          this.returnUrl = '/profile';
        }
        this._router.navigate([this.returnUrl]);
      },
      (error) => {
        this.signing = false;
        this.loginError = true;
        this.loginErrorMsg = error.error.message;
      }
    );
  }

  onSignup(f: NgForm) {
    console.log(f.value.email);
    console.log(f.value.password);
    console.log(f.value.confirm_password);

    this.registering = true;

    this._authService.register(f.value.email, f.value.password, f.value.name).subscribe(
      (user: User) => {
        // console.log(user);
        this._toastr.success('A validation email has been sent, please validate by clicking the link in email');
      },
      (error) => {
        this.registering = false;
        this.regError = true;
        this.regErrorMsg = error.error.message;
        this._toastr.error('Error');
      }
    );
  }

  onFacebookLogin() {
    this.fb.login({scope: 'email,public_profile'})
      .then((response: LoginResponse) => { 
        // console.log(response); 
        if (response && response.status === "connected") {
          const authRes = response.authResponse;
          this._authService.fbLogin(authRes).subscribe(
            
            (user: any) => {
              // console.log("[onFacebookLogin]: ", user);
              if (user.role === 'normal') {
                this.returnUrl = '/profile';
              }
              this._router.navigate([this.returnUrl]);
            },
            (error) => {
              this.signing = false;
              this.loginError = true;
              this.loginErrorMsg = error.error.message;
            }
          );
          this._toastr.success('Connected');
        } else {
          this._toastr.error('Something went wrong!');
        }
      })
      .catch((error: any) => console.error(error));

  }

  onCheckPassword(f: NgForm) {
    if (f.value.password !== f.value.confirm_password) {
      this.regError = true;
      this.regErrorMsg = 'Password doesn\'t match';
    } else {
      this.regError = false;
    }
  }

  handleSuccess(captchaResponse: string): void {
    this.captchaSuccess = true;
    this.captchaResponse = captchaResponse;
    this.captchaIsExpired = false;
    this.cdr.detectChanges();
  }

  handleLoad(): void {
    this.captchaIsLoaded = true;
    this.captchaIsExpired = false;
    this.cdr.detectChanges();
  }

  handleExpire(): void {
    this.captchaSuccess = false;
    this.captchaIsExpired = true;
    this.cdr.detectChanges();
  }
  handleReady():void {
    console.log('handle ready');
  }
}
