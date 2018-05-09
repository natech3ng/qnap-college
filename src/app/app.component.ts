import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CategoryService } from './_services/category.service';
import { Category } from './_models/category';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('cElement', {read: ElementRef}) cElement: ElementRef;
  categories: Category [] = [];
  cGridWidth: Number = 0;

  constructor(private _categoryService: CategoryService) {
    this._categoryService.all().subscribe(
      (categories: Category []) => {
        this.categories = categories;
        console.log(this.categories);
        setTimeout( () => {
          this.cGridWidth = this.cElement.nativeElement.offsetWidth;
          console.log(this.cElement.nativeElement.offsetWidth);
        }, 100);
      },
      (error) => {
      }
    );
  }

  ngOnInit() {}

  ngAfterViewInit() {
  }
}
