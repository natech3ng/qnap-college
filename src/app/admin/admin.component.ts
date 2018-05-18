import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';
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
  routeSub: Subscription;
  loading = false;

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
        // console.log('params changed');
      }
    );
  }

  ngAfterViewInit() {
    this.routeSub = this._router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.loading = true;
          // console.log('Admin navigate start');
        } else if (
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel
            ) {
          this.loading = false;
          // console.log('Admin navigate end');
        }
    });
  }

  ngOnDestroy() {}

  onSignout () {
    console.log('signout');
    this._authService.logout();
    // this._router.navigateByUrl('/admin');
    location.reload();
  }

}
