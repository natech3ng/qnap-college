import { DomSanitizer } from '@angular/platform-browser';
import { ModalService } from '../_services/modal.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CategoryService } from '../_services/category.service';
import { Category } from '../_models/category';
import { Router, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';
import { SearchComponent } from '../pages/search/search.component';
import { SearchService } from '../_services/search.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgcCookieConsentService, NgcInitializeEvent, NgcStatusChangeEvent } from 'ngx-cookieconsent';

import reframe from 'reframe.js';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxScreensizeService } from '../modules/ngx-screensize/_services/ngx-screensize.service';
import { HttpClient } from '@angular/common/http';

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
  loading: boolean;
  keywords: string;
  goToTop: boolean;
  modalOpen: boolean;
  firstOpened: boolean;
  youtubeSrc: any;
  youtubeRef: string;

  public YT: any;
  public video: any;
  public player: any;
  public reframed = false;
  youtubeVideoWidth = 853;
  youtubeVideoHeight = 480;

  deviceInfo: any = null;

  headerHTML = '';
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
    private _httpClient: HttpClient) {

      this.deviceInfo = this._deviceService.getDeviceInfo();
      console.log(this.deviceInfo);
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
        console.log(this.player.getCurrentTime());
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
            // console.log('Navigate end');
        }
    });

    if (window.pageYOffset > this.headerEl.nativeElement.offsetHeight) {
      this.goToTop = true;
    }
    // console.log(this.el.nativeElement.offsetHeight);
    setTimeout(() => { this.loading = false; }, 0);

    this._httpClient.get('https://www.qnap.com/i/_aid/header.php?lang_set=en-us&lc_demo=/solution/virtualization-station-3/en/', {responseType: 'text'}).subscribe(
      (data) => {
        this.headerHTML = data;
        console.log(data);
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
  }

  onSubmit(f: NgForm) {
    this._router.navigate(['/search', f.value.keywords]);
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
}
