import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';

import { environment } from '../../../environments/environment.dev';
import { VerificationSuccessComponent } from './success.component';
import { VerificationFailedComponent } from './failure.component';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'verification',
  template: '<div #container><span>Verifiing...</span></div>'
})
export class VerificationComponent implements OnInit, AfterViewInit, OnDestroy {
  title: string = 'Verification Component';
  private sub:any;
  private querySub: any;
  valid = true;
  private uid: string;
  private token: string;

  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private _route: ActivatedRoute,
    private authService: AuthService) {}
  
  ngOnInit() {
    this.sub = this._route.params.subscribe(params => {
      console.log(params);
      this.uid = params['id'];
    });

    this.querySub = this._route.queryParams.subscribe(params => {
      console.log(params);
      this.token = params['token'];
    });
  }
  ngAfterViewInit() {
    
    this.authService.verifyEmail(this.uid, this.token).subscribe(
      (res: any) => {
        console.log(res);
        // this._router.navigate([this.returnUrl]);
      },
      (error) => {
      }
    );
    if (this.valid ) {
      setTimeout( () => { this.loadComponent(VerificationSuccessComponent);}, 2000);
    } else {
      setTimeout( () => { this.loadComponent(VerificationFailedComponent);}, 2000);
    }
    
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.querySub.unsubscribe();
  }

  loadComponent(component: any) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(component);
    this.container.clear();
    let el : HTMLElement = this.container.element.nativeElement;
    el.innerHTML = '';

    const ref = this.container.createComponent(factory);
    ref.changeDetectorRef.detectChanges();
    
  }

  

}
