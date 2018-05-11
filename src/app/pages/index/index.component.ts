import { ModalService } from './../../_services/modal.service';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Category } from '../../_models/category';
import { CategoryService } from '../../_services/category.service';
import { ActivatedRoute, Data } from '@angular/router';
import { Course } from '../../_models/course';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('cElement', {read: ElementRef}) cElement: ElementRef;
  private sub: any;
  categories: Category [];
  courses: Course [];
  cGridWidth: Number;
  gridCol: Number;
  gridClass: String;

  constructor(
    private _categoryService: CategoryService,
    private _route: ActivatedRoute,
    private _modalService: ModalService) {
      const localColSetting = localStorage.getItem('grid-col');
      this.cGridWidth = 0;
      this.categories = [];
      this.courses = [];
      this.gridCol = localColSetting ? + localColSetting : 2;
      this.gridCol === 2 ? this.gridClass = 'col-md-5' : this.gridClass = 'col-md-4';
    }

  ngOnInit() {
    this.sub = this._route.data.subscribe(
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
}
