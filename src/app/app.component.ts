import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CategoryService } from './_services/category.service';
import { Category } from './_models/category';
import { Router, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';
import { SearchComponent } from './pages/search/search.component';
import { SearchService } from './_services/search.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('header') headerEl: ElementRef;
  private sub: any;
  private routeSub: any;
  loading: Boolean;
  keywords: String;
  goToTop: Boolean;

  @HostListener('window:scroll', ['$event'])
  currentPosition() {
    // console.log('Scroll Event', window.pageYOffset );
    if (window.pageYOffset > this.headerEl.nativeElement.offsetHeight) {
      this.goToTop = true;
    } else {
      this.goToTop = false;
    }
  }

  constructor(private _router: Router, private _searchService: SearchService) {
    this.loading = true;
    this.goToTop = false;
  }

  ngOnInit() {
    this.sub = this._searchService.search.subscribe(
      (keywords) => {
        setTimeout(() => { this.keywords = keywords; }, 0);
      }
    );
  }
  ngAfterViewInit() {

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
  }

  onSubmit(f: NgForm) {
    this._router.navigate(['/search', f.value.keywords]);
  }
}
