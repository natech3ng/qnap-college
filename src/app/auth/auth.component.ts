import { User } from './_models/user.model';
import { AuthResponse } from './../_models/authresponse';
import { AuthService } from './_services/auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  signing: boolean;
  returnUrl: string;
  signin: boolean;
  loginError = false;
  loginErrorMsg: '';

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _authService: AuthService) {
      // console.log(this._route.snapshot.url[0].path);
      this._route.url.subscribe(
        (url) => {
          url[0].path === 'login' ? this.signin = true : this.signin = false;
        }
      );
    }

  ngOnInit() {
    this.signing = false;
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/admin';
  }

  ngOnDestroy() {
    this.signing = false;
  }

  onSignin(f: NgForm) {
    this.signing = true;
    this._authService.login(f.value.email, f.value.password).subscribe(
      (user: User) => {
        // console.log(user);
        this._router.navigate([this.returnUrl]);
      },
      (error) => {
        this.signing = false;
        this.loginError = true;
        this.loginErrorMsg = error.error.message;
      }
    );
  }
}
