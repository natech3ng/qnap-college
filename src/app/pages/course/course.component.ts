import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Subscription } from 'rxjs';
import { Course } from '../../_models/course';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, OnDestroy {

  sub: Subscription;
  routeSub: Subscription;
  course: Course;
  youtubeSrc;
  constructor(private _route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this._route.params.subscribe(params => {
      console.log(params['id']);
    });

    this.routeSub = this._route.data.subscribe(
      (data: Data) => {
        if (data.course) {
          this.course = data.course;
          this.youtubeSrc = '';
        }
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.routeSub.unsubscribe();
  }

}
