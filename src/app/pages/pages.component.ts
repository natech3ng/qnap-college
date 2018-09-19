import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ModalService } from '../_services/modal.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CategoryService } from '../_services/category.service';
import { Category } from '../_models/category';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, RoutesRecognized, RouteConfigLoadEnd } from '@angular/router';
import { SearchComponent } from '../pages/search/search.component';
import { SearchService } from '../_services/search.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgcCookieConsentService, NgcInitializeEvent, NgcStatusChangeEvent } from 'ngx-cookieconsent';

import reframe from 'reframe.js';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxScreensizeService } from '../modules/ngx-screensize/_services/ngx-screensize.service';
import { HttpClient } from '@angular/common/http';
import { AddThisService } from '../_services/addthis.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('header') headerEl: ElementRef;
  private sub: any;
  private routeSub: any;
  private modalPopSub: any;
  private modalCloseSub: any;
  private youtubeSrc: any;
  private youtubeRef: string;

  public bannerShow: boolean;
  public goToTop: boolean;
  public loading: boolean;
  public keywords: string;
  public modalOpen: boolean;
  public firstOpened: boolean;

  private YT: any;
  private video: any;
  private player: any;
  private reframed = false;
  private youtubeVideoWidth = 853;
  private youtubeVideoHeight = 480;

  deviceInfo: any = null;

  _headerHTML = '';
  _footerHTML = '';
  private addThisSub: Subscription;
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
      // Escape/ESC button;
      this.onCloseModal();
    }
  }

  @HostListener('window:orientationchange', ['$event'])
  handleOC() {
    this.youtubeVideoWidth = this._ssService.getScreensize().x;
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
    private _ccService: NgcCookieConsentService,
    private _deviceService: DeviceDetectorService,
    private _ssService: NgxScreensizeService,
    private _httpClient: HttpClient,
    private _sanitizer: DomSanitizer,
    private _addThis: AddThisService) {

      this.deviceInfo = this._deviceService.getDeviceInfo();
      // console.log(this.deviceInfo);
      const url = this._router.url;
      this.checkBanner(url);
      this._router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          (<any>window).ga('set', 'page', event.urlAfterRedirects);
          (<any>window).ga('send', 'pageview');
        }
      });
    }

  ngOnInit() {
    const tag = document.createElement('script');
    tag.src = '//www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    this.loading = true;
    this.goToTop = false;
    this.modalOpen = false;
    this.firstOpened = false;
    this.youtubeSrc = 'https://www.youtube.com/embed/ShnVe3QReRk';

    this.sub = this._searchService.search.subscribe(
      (keywords) => {
        setTimeout(() => { this.keywords = keywords; }, 0);
      }
    );

    this.modalPopSub = this._modalService.pop.subscribe(
      (youtubeRef: string) => {
        this.youtubeRef = youtubeRef;
        this.youtubeSrc = 'https://www.youtube.com/embed/' + youtubeRef;
        this.modalOpen = true;
        this.firstOpened = true;

        let startTime = 0;
        if (localStorage.getItem(this.youtubeRef)) {
          startTime = +localStorage.getItem(this.youtubeRef);
        }
        this.player.loadVideoById(this.youtubeRef, startTime);
      }
    );

    this.modalCloseSub = this._modalService.close.subscribe(
      () => {
        // console.log(this.player.getCurrentTime());
        localStorage.setItem(this.youtubeRef.toString(), this.cleanTime().toString());
        this.modalOpen = false;
        this.youtubeSrc = '';
        this.youtubeRef = '';
        this.player.stopVideo();
      }
    );

    // subscribe to cookieconsent observables to react to main events
    this.popupOpenSubscription = this._ccService.popupOpen$.subscribe(
      () => {
        // you can use this._ccService.getConfig() to do stuff...
        // console.log('popupOpen');
      });

    this.popupCloseSubscription = this._ccService.popupClose$.subscribe(
      () => {
        // you can use this._ccService.getConfig() to do stuff...
        // console.log('popuClose');
      });

    this.initializeSubscription = this._ccService.initialize$.subscribe(
      (event: NgcInitializeEvent) => {
        // you can use this._ccService.getConfig() to do stuff...
        // console.log(`initialize: ${JSON.stringify(event)}`);
      });

    this.statusChangeSubscription = this._ccService.statusChange$.subscribe(
      (event: NgcStatusChangeEvent) => {
        // you can use this._ccService.getConfig() to do stuff...
        // console.log(`statusChange: ${JSON.stringify(event)}`);
      });

    this.revokeChoiceSubscription = this._ccService.revokeChoice$.subscribe(
      () => {
        // you can use this._ccService.getConfig() to do stuff...
        // console.log(`revokeChoice: ${JSON.stringify(event)}`);
      });
  }
  ngAfterViewInit() {

    if (this._ssService.getScreensize().x <= 768 ) {
      this.youtubeVideoWidth = this._ssService.getScreensize().x;
      this.youtubeVideoHeight = Math.trunc(this.youtubeVideoWidth * (480 / 853));
    }

    window['onYouTubeIframeAPIReady'] = (e) => {
      this.YT = window['YT'];
      this.reframed = true;
      this.player = new window['YT'].Player('player', {
        videoId: this.youtubeRef,
        width: this.youtubeVideoWidth,
        height: this.youtubeVideoHeight,
        playsinline: 0,
        events: {
          'onStateChange': this.onPlayerStateChange.bind(this),
          'onError': this.onPlayerError.bind(this),
          'onReady': (event) => {
            if (!this.reframed) {
              this.reframed = true;
              reframe(event.target.a);
            }
          }
        }
      });
    };
    // console.log(this._ccService.getConfig());
    this.routeSub = this._router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
            this.loading = true;

            // console.log('Navigate start');
        } else if (
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel
            ) {
            this.loading = false;
            console.log(this._router.url);
            this.checkBanner(this._router.url);
            // console.log('Navigate end');
        } else if ( event instanceof RouteConfigLoadEnd) {
        }
    });

    if (window.pageYOffset > this.headerEl.nativeElement.offsetHeight) {
      this.goToTop = true;
    }
    // console.log(this.el.nativeElement.offsetHeight);
    setTimeout(() => { this.loading = false; }, 0);
    this.addThisSub = this._addThis.initAddThis('ra-5a0dd7aa711366bd', false).subscribe();
    // this._httpClient.get('https://www.qnap.com/i/_aid/header.php?lang_set=en-us&lc_demo=/solution/virtualization-station-3/en/', {responseType: 'text'}).subscribe(
    //   (data) => {
    //     setTimeout(() => {
    //       this._headerHTML = data;
    //     }, 2000);
    //   },
    //   (error) => {
    //   }
    // );
    // this.loadScript('//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5a0dd7aa711366bd');
    this._httpClient.get('https://www.qnap.com/i/_aid/footer.php?lang_set=en-us&lc_demo=/solution/virtualization-station-3/en/', {responseType: 'text'}).subscribe(
      (data) => {
        this._footerHTML = data;
      },
      (error) => {
      }
    );
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
    this.addThisSub.unsubscribe();
  }

  onSubmit(f: NgForm) {
    this._router.navigate(['/search', f.value.keywords], { queryParams: { q: f.value.keywords } });
  }

  onCloseModal() {
    this._modalService.closeModal();
  }

  onPlayerStateChange(event) {
    // console.log(event);
    switch (event.data) {
      case window['YT'].PlayerState.PLAYING:
        if (this.cleanTime() === 0) {
          // console.log('started ' + this.cleanTime());
        } else {
          // console.log('playing ' + this.cleanTime());
        }
        break;
      case window['YT'].PlayerState.PAUSED:
        if (this.player.getDuration() - this.player.getCurrentTime() !== 0) {
          // console.log('paused' + ' @ ' + this.cleanTime());
        }
        break;
      case window['YT'].PlayerState.ENDED:
        // console.log('ended ');
        break;
    }
  }

  // utility
  cleanTime() {
    return Math.round(this.player.getCurrentTime());
  }
  onPlayerError(event) {
    switch (event.data) {
      case 2:
        // console.log('' + this.video);
        break;
      case 100:
        break;
      case 101 || 150:
        break;
    }
  }

  public get headerHTML(): SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(this._headerHTML);
  }

  public get footerHTML(): SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(this._footerHTML);
  }

  private loadScript(script) {
    const body = <HTMLDivElement> document.body;
    const scriptDOM = document.createElement('script');
    scriptDOM.innerHTML = '';
    scriptDOM.src = script;
    scriptDOM.async = true;
    scriptDOM.defer = true;
    body.appendChild(scriptDOM);
  }

  private checkBanner(url) {
    if (url === '/' || url.indexOf('/category/') !== -1 || url.indexOf('/search/') !== -1) {
      // banner only appears in home, category, and search pages
      this.bannerShow = true;
    } else {
      this.bannerShow = false;
    }
  }
}
