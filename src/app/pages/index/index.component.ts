import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Category } from '../../_models/category';
import { CategoryService } from '../../_services/category.service';
import { ActivatedRoute, Data } from '@angular/router';
import { Course } from '../../_models/course';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, AfterViewInit {

  @ViewChild('cElement', {read: ElementRef}) cElement: ElementRef;
  categories: Category [] = [];
  courses: Course [] = [];
  cGridWidth: Number = 0;

  constructor(
    private _categoryService: CategoryService,
    private _route: ActivatedRoute) {}

  ngOnInit() {
    this._route.data.subscribe(
      (data: Data) => {
        if (data.courses) {
          this.courses = data.courses;
          setTimeout( () => {
            this.cGridWidth = this.cElement.nativeElement.offsetWidth;
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
  }
}
