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

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _authService: AuthService) {}

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
        console.log(error);
      }
    );
  }
}
