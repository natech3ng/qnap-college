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

import reframe from 'reframe.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  ngOnInit() {}

  ngAfterViewInit() {}

  ngOnDestroy() {}
}
