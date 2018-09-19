import { CourseDoc } from './../../_models/document';
import { ModalService } from './../../_services/modal.service';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { Category } from '../../_models/category';
import { CategoryService } from '../../_services/category.service';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Course } from '../../_models/course';
// import { NgxScreensizeModule } from '../../modules/ngx-screensize';
import { NgxScreensizeService } from '../../modules/ngx-screensize/_services/ngx-screensize.service';
// import { CoursesComponent } from '../../admin/courses/courses.component';
import { CourseService } from '../../_services/course.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('cElement', {read: ElementRef}) cElement: ElementRef;
  @ViewChild('collection', {read: ElementRef}) collectionEl: ElementRef;
  private sub: any;
  categories: Category [];
  courses: Course [];
  cGridWidth: Number;
  gridCol: Number;
  gridClass: String;
  toCollection: boolean;
  menuOpen: boolean;
  menuOpenForStyle: boolean;
  displayOptions;
  currentDisplay;
  loading;
  cs;
  page = 1;
  loadingmore = false;
  totalPages = 0;
  finished = false;

  @HostListener('window:scroll', ['$event'])
  currentPosition() {
    if (window.pageYOffset + 300 > this.collectionEl.nativeElement.offsetHeight) {
      this.toCollection = false;  // set true if wanna enable the collection button.
    } else {
      this.toCollection = false;
    }
  }

  constructor(
    private _categoryService: CategoryService,
    private _route: ActivatedRoute,
    private _modalService: ModalService,
    private _ssService: NgxScreensizeService,
    private _courseService: CourseService,
    private _router: Router) {
    }

  ngOnInit() {
    const localColSetting = localStorage.getItem('grid-col');
    this.cGridWidth = 0;
    this.categories = [];
    this.courses = [];
    this.gridCol = localColSetting ? + localColSetting : 2;
    this.gridCol === 2 ? this.gridClass = 'col-md-5' : this.gridClass = 'col-md-4';
    this.menuOpen = false;
    this.menuOpenForStyle = false;
    this.displayOptions = this._courseService.options;
    this.loading = false;
    this.cs = localStorage.getItem('currentDisplay');
    this.sub = this._route.data.subscribe(
      (data: Data) => {
        if (data.coursedoc) {
          // console.log(data.coursedoc);
          this.courses = data.coursedoc.docs;
          this.totalPages = data.coursedoc.pages;
          setTimeout( () => {
            const screenClass = this._ssService.sizeClass();
            if (screenClass === 'xs' || screenClass === 'sm') {
              this.cGridWidth = this.cElement.nativeElement.offsetWidth / 3;
            } else {
              this.cGridWidth = this.cElement.nativeElement.offsetWidth;
            }
            // console.log(this.cElement.nativeElement.offsetWidth);
            }, 100);
        }

        if (data.categories) {
          this.categories = data.categories;
        }
      }
    );
  }

  ngAfterViewInit() {
    // const cs = localStorage.getItem('currentDisplay');
    setTimeout(() => {
      if (this.cs) {
        this.currentDisplay = this.cs;
      } else {
        this.currentDisplay = 'Latest';
      }
    }, 0);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onGridSelect(grid: number) {
    this.gridCol = grid;
    localStorage.setItem('grid-col', this.gridCol.toString());
  }

  onModalPop(course: Course) {
    this._courseService.quickClicked(course);
    this._modalService.popModal(course.youtube_ref);
  }

  toggleMenu() {
    if ( !this.menuOpen ) {
      setTimeout(() => {
        this.menuOpenForStyle = !this.menuOpenForStyle;
      }, 400);
    } else {
      this.menuOpenForStyle = !this.menuOpenForStyle;
    }
    this.menuOpen = !this.menuOpen;
  }

  changeDisplayTo(option) {
    this.loading = true;
    localStorage.setItem('currentDisplay', option.name);
    this.currentDisplay = option.name;
    this.cs = option.value;
    this.page = 1;
    this.toggleMenu();
    this._courseService.all(6, option.value, this.page).subscribe(
      (coursedoc: CourseDoc) => {
        this.courses = coursedoc.docs;
        this.loading = false;
      },
      (error) => {
        console.log('Something went wrong!');
        this.loading = false;
      }
    );
  }

  onScroll () {
    // console.log('scrolled!!');
    this.loadingmore = true;
    this.page += 1;

    this._courseService.all(6, this.cs, this.page).subscribe(
      (newcoursedoc: CourseDoc) => {
        // console.log(newcoursedoc);
        for ( const doc of newcoursedoc.docs) {
          this.courses.push(doc);
        }

        if (this.page === this.totalPages) {
          this.finished = true;
          // console.log('finished.');
        }

        this.loadingmore = false;
      },
      (err) => {
        this._router.navigate(['/maintenance']);
      return [];
      }
    );
  }
}
