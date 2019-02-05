import { FacebookService, InitParams, LoginResponse } from 'ngx-facebook';
import { User } from './_models/user.model';
import { AuthService } from './_services/auth.service';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, NgZone, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReCaptchaV3Service, ReCaptcha2Component } from 'ngx-captcha';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import * as ResCode from '../_codes/response';
import { AddScriptService } from '../_services/addscript.service';

declare var gapi: any;

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy, AfterViewInit {
  signing: boolean = false;
  registering: boolean = false;
  returnUrl: string;
  signin: boolean;
  loginError = false;
  loginErrorMsg = '';
  regError = false;
  regErrorMsg = '';
  loading: boolean = false;
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

  GoogleAuth: any;

  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _authService: AuthService,
    private reCaptchaV3Service: ReCaptchaV3Service,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private _toastr: ToastrService, 
    private fb: FacebookService,
    private ngZone: NgZone,
    private _addScript: AddScriptService) {
      // console.log(this._route.snapshot.url[0].path);
      this._route.url.subscribe(
        (url) => {
          url[0].path === 'login' ? this.signin = true : this.signin = false;
        }
      );

      let initParams: InitParams = {
        appId: environment.FBId,
        xfbml: true,
        version: 'v2.8'
      };
  
      fb.init(initParams);
      gapi.load('auth2', () => {
        console.log('[gapi.load] auth2 ready', )
        gapi.auth2.init({
          'clientId': environment.GoogleClientID
          // 'scope': 'profile'
          // 'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
        }).then((onInit) => {
          console.log('qapi:auth2 loaded');
          this.GoogleAuth = gapi.auth2.getAuthInstance();
          
        }, (onError) => {
          this.loading = false;
          console.log(onError);

        });
      });
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

  ngAfterViewInit() {
    this._addScript.addMeta({
      name: 'google-signin-client_id',
      content: environment.GoogleClientID
    })
  }

  onSignin(f: NgForm) {
    this.signing = true;
    this.loading = true;
    // this.reCaptchaV3Service.execute(this.siteKey, 'login', (token) => {
    //   console.log('This is your token: ', token);
    // });

    this._authService.login(f.value.email, f.value.password).subscribe(
      (user: User) => {
        console.log(user);
        if (user.role.level === 1) {
          this.returnUrl = '/profile';
        }
        this.loading = false;
        this._router.navigate([this.returnUrl]);
      },
      (error) => {
        this.signing = false;
        this.loading = false;
        this.loginError = true;
        this.loginErrorMsg = error.error.message;
      }
    );
  }

  onSignup(f: NgForm) {
    // console.log(f.value.email);
    // console.log(f.value.password);
    // console.log(f.value.confirm_password);

    this.loading = true;
    this.registering = true;

    this._authService.register(f.value.email, f.value.password, f.value.name).subscribe(
      (user: User) => {
        // console.log(user);
        this.loading = false;
        this._toastr.success('A validation email has been sent, please validate by clicking the link in email');
      },
      (error) => {
        this.loading = false;
        this.registering = false;
        this.regError = true;
        this.regErrorMsg = error.error.message;
        this._toastr.error('Error');
      }
    );
  }

  onFacebookLogin() {
    this.loading = true;
    this.fb.login({scope: 'email,public_profile'})
      .then((response: LoginResponse) => { 
        // console.log(response); 
        if (response && response.status === "connected") {
          const authRes = response.authResponse;
          this.loading = false;
          this._authService.fbLogin(authRes).subscribe(
            
            (res: any) => {
              // console.log("[onFacebookLogin]", res);
              if (res.code === ResCode.PASSWORD_HAS_NOT_BEEN_CREATED) {
                
                this._router.navigate(['/user/create-password', res.uid], { queryParams: { token:  res.token, from: 'fb'} });
              } else {
                if (res.role.name === 'normal') {
                  this.returnUrl = '/profile';
                }
                this._router.navigate([this.returnUrl]);
              }
            },
            (error) => {
              this.loading = false;
              console.log(error);
              this.signing = false;
              this.loginError = true;
              this.loginErrorMsg = error.error.message;
            }
          );
          this.loading = false;
          this._toastr.success('Connected');
        } else {
          this.loading = false;
          this._toastr.error('Something went wrong!');
        }
      })
      .catch((error: any) => console.error(error));

  }

  onGoogleLogin() {
    this.loading = true;
    this.signing = true;
    // console.log(this.GoogleAuth);
    if (this.GoogleAuth) {
      this.GoogleAuth.signIn(
        {
          scope: 'profile email'
      }).then((googleUser) => {
        const id_token = googleUser.getAuthResponse().id_token;
        this._toastr.success('Connected');
        // console.log('signed in')
        const profile = googleUser.getBasicProfile();
        // console.log(profile);
        // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        // console.log('Name: ' + profile.getName());
        // console.log('Image URL: ' + profile.getImageUrl());
        // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
        // console.log('ID Token: ' + id_token);
        const payload = {
          id: profile.getId(),
          name: profile.getName(),
          picture: profile.getImageUrl(),
          accessToken: id_token
        }
        this._authService.googleLogin(payload).subscribe(
          (res: any) => {
            this.loading = false;
            this.signing = false;
            // console.log("[onFacebookLogin]", res);
            if (res.code === ResCode.PASSWORD_HAS_NOT_BEEN_CREATED) {
                
              this._router.navigate(['/user/create-password', res.uid], { queryParams: { token:  res.token, from: 'google'} });
            } else {
              // console.log('logged in');
              if (res.role.name === 'normal') {
                this.returnUrl = '/profile';
              }
              // console.log('Navigate to', this.returnUrl);
              this._navigate([this.returnUrl]);
              // this._router.navigate([this.returnUrl]);
            }
          },
          (err: any) => {
            this.loading = false;
            this.signing = false;
            // console.log(err); 
          }
        );
      },
      (error) => {
        // console.log('signed in failed, ', error);
        this.loading = false;
        this.signing = false;
      }).catch((err) => {
        this.loading = false;
        this.signing = false;
        // console.log(err)
      });
    }
  }

  private _navigate(commands: any[]): void {
    this.ngZone.run(() => this._router.navigate(commands)).then();
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
