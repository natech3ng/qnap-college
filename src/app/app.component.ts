import { DomSanitizer } from '@angular/platform-browser';
import { ModalService } from './_services/modal.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CategoryService } from './_services/category.service';
import { Category } from './_models/category';
import { Router, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';
import { SearchComponent } from './pages/search/search.component';
import { SearchService } from './_services/search.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgcCookieConsentService, NgcInitializeEvent, NgcStatusChangeEvent } from 'ngx-cookieconsent';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('header') headerEl: ElementRef;
  private sub: any;
  private routeSub: any;
  private modalPopSub: any;
  private modalCloseSub: any;
  loading: Boolean;
  keywords: String;
  goToTop: Boolean;
  modalOpen: Boolean;
  firstOpened: Boolean;
  youtubeSrc: any;

  // keep refs to subscriptions to be able to unsubscribe later
  private popupOpenSubscription: Subscription;
  private popupCloseSubscription: Subscription;
  private initializeSubscription: Subscription;
  private statusChangeSubscription: Subscription;
  private revokeChoiceSubscription: Subscription;

  @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
    // console.log(event);
    const x = event.keyCode;
    if (x === 27) {
      // console.log('Escape!');
      this.onCloseModal();
    }
  }

  @HostListener('window:scroll', ['$event'])
  currentPosition() {
    if (window.pageYOffset > this.headerEl.nativeElement.offsetHeight) {
      this.goToTop = true;
    } else {
      this.goToTop = false;
    }
  }

  constructor(
    private _router: Router,
    private _searchService: SearchService,
    private _modalService: ModalService,
    private _ccService: NgcCookieConsentService) {
    this.loading = true;
    this.goToTop = false;
    this.modalOpen = false;
    this.firstOpened = false;
      }

  ngOnInit() {
    this.youtubeSrc = 'https://www.youtube.com/embed/ShnVe3QReRk';

    this.sub = this._searchService.search.subscribe(
      (keywords) => {
        setTimeout(() => { this.keywords = keywords; }, 0);
      }
    );

    this.modalPopSub = this._modalService.pop.subscribe(
      (youtubeRef: String) => {
        this.youtubeSrc = 'https://www.youtube.com/embed/' + youtubeRef;
        this.modalOpen = true;
        this.firstOpened = true;
      }
    );

    this.modalCloseSub = this._modalService.close.subscribe(
      () => {
        this.modalOpen = false;
        this.youtubeSrc = '';
      }
    );

    // subscribe to cookieconsent observables to react to main events
    this.popupOpenSubscription = this._ccService.popupOpen$.subscribe(
      () => {
        // you can use this._ccService.getConfig() to do stuff...
        console.log('popupOpen');
      });

    this.popupCloseSubscription = this._ccService.popupClose$.subscribe(
      () => {
        // you can use this._ccService.getConfig() to do stuff...
        console.log('popuClose');
      });

    this.initializeSubscription = this._ccService.initialize$.subscribe(
      (event: NgcInitializeEvent) => {
        // you can use this._ccService.getConfig() to do stuff...
        console.log(`initialize: ${JSON.stringify(event)}`);
      });

    this.statusChangeSubscription = this._ccService.statusChange$.subscribe(
      (event: NgcStatusChangeEvent) => {
        // you can use this._ccService.getConfig() to do stuff...
        console.log(`statusChange: ${JSON.stringify(event)}`);
      });

    this.revokeChoiceSubscription = this._ccService.revokeChoice$.subscribe(
      () => {
        // you can use this._ccService.getConfig() to do stuff...
        console.log(`revokeChoice: ${JSON.stringify(event)}`);
      });
  }
  ngAfterViewInit() {

    console.log(this._ccService.getConfig());
    this.routeSub = this._router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
            this.loading = true;
        } else if (
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel
            ) {
            this.loading = false;
        }
    });

    if (window.pageYOffset > this.headerEl.nativeElement.offsetHeight) {
      this.goToTop = true;
    }
    // console.log(this.el.nativeElement.offsetHeight);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.routeSub.unsubscribe();
    this.modalPopSub.unsubscribe();

    // unsubscribe to cookieconsent observables to prevent memory leaks
    this.popupOpenSubscription.unsubscribe();
    this.popupCloseSubscription.unsubscribe();
    this.initializeSubscription.unsubscribe();
    this.statusChangeSubscription.unsubscribe();
    this.revokeChoiceSubscription.unsubscribe();
  }

  onSubmit(f: NgForm) {
    this._router.navigate(['/search', f.value.keywords]);
  }

  onCloseModal() {
    this._modalService.closeModal();
  }
}
