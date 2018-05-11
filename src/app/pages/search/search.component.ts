import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Course } from '../../_models/course';
import { ActivatedRoute, Data } from '@angular/router';
import { SearchService } from '../../_services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: '../category/category.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  private sub: any;
  // @Output() search: EventEmitter<any> = new EventEmitter();
  courses: Course [];
  func: String;
  gridCol: Number;
  gridClass: String;

  constructor(private _route: ActivatedRoute, private _searchService: SearchService) {
    this.func = 'search';
    this.courses = [];
    const localColSetting = localStorage.getItem('grid-col');
    this.gridCol = localColSetting ? + localColSetting : 2;
    this.gridCol === 2 ? this.gridClass = 'col-md-5' : this.gridClass = 'col-md-4';
  }

  ngOnInit() {
    this.sub = this._route.params.subscribe(params => {
      this._searchService.emit(params['keywords']);
      // this.search.emit(params['keywords']);
    });

    this._route.data.subscribe(
      (data: Data) => {
        if (data.courses) {
          // console.log(data.courses);
          this.courses = data.courses;
        }
      }
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onGridSelect(grid: number) {
    this.gridCol = grid;
    localStorage.setItem('grid-col', this.gridCol.toString());
  }
}
