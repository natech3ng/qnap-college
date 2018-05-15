import { ActivatedRoute, Data } from '@angular/router';
import { Subscription } from 'rxjs';
import { Course } from './../../_models/course';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ConfirmService } from '../../_services/confirm.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CoursesComponent implements OnInit, OnDestroy {

  app = 'Courses';
  courses: Course [] = [];
  sub: Subscription;
  constructor(
    private _route: ActivatedRoute,
    private _confirmService: ConfirmService) { }

  ngOnInit() {
    this.sub = this._route.data.subscribe(
      (data: Data) => {
        if (data.courses) {
          this.courses = data.courses;
          for (const course of this.courses) {
            course['tags'] = [];
            if (course['keywords']) {
              course['tags'] = course['keywords'].split(' ');
            }
            // console.log(course['tags']);
          }
        }
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onDelete(course: Course) {
    this._confirmService.open('Do you want to delete?').then(
      () => {
        console.log('ok');
      }).catch( () => {
        // Reject
        console.log('no');
      });
  }

}
