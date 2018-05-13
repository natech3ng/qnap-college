import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../auth/_services/auth.service';
import { OnInit, AfterViewInit, OnDestroy, Component } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit, OnDestroy {

  loggedIn: boolean;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _authService: AuthService,
    private _location: Location) {
    this.loggedIn = this._authService.loggedIn;
  }

  ngOnInit() {
    this._route.params.subscribe(
      () => {
        console.log('params changed');
      }
    );
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {}

  onSignout () {
    console.log('signout');
    this._authService.logout();
    // this._router.navigateByUrl('/admin');
    location.reload();
  }

}
