import { ModalService } from './../../_services/modal.service';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { Category } from '../../_models/category';
import { CategoryService } from '../../_services/category.service';
import { ActivatedRoute, Data } from '@angular/router';
import { Course } from '../../_models/course';
import { NgxScreensizeModule } from '../../modules/ngx-screensize';
import { NgxScreensizeService } from '../../modules/ngx-screensize/_services/ngx-screensize.service';
import { CoursesComponent } from '../../admin/courses/courses.component';
import { CourseService } from '../../_services/course.service';

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
    private _courseService: CourseService) {
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
    this.sub = this._route.data.subscribe(
      (data: Data) => {
        if (data.courses) {
          this.courses = data.courses;
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
    const cs = localStorage.getItem('currentDisplay');
      if (cs) {
        this.currentDisplay = cs;
      } else {
        this.currentDisplay = 'Latest';
      }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onGridSelect(grid: number) {
    this.gridCol = grid;
    localStorage.setItem('grid-col', this.gridCol.toString());
  }

  onModalPop(youtubeRef: String) {
    this._modalService.popModal(youtubeRef);
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
    this.toggleMenu();
    this._courseService.all(6, option.value).subscribe(
      (courses: Course []) => {
        this.courses = courses;
        this.loading = false;
      },
      (error) => {
        console.log('Something went wrong!');
        this.loading = false;
      }
    );
  }
}
