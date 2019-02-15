import { ActivatedRoute, Data } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})

export class CommentsComponent implements OnInit, AfterViewInit, OnDestroy {
  app = 'Comments';
  sub: Subscription;
  page: 1;
  pages: 1;
  comments = [];
  total = 0;

  constructor(
    private _route: ActivatedRoute
  ){}
  ngOnInit() {
    this.sub = this._route.data.subscribe(
      (data: Data) => {
        console.log(data);
        if (data.doc) {
          const doc = data.doc.payload;
          this.comments = doc.docs;
          this.page = doc.page;
          this.pages = doc.pages;
          this.total = doc.total;
        }
      });;
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  onSearch(e) {
    console.log(e.target.value);
  }

  
}