import { ActivatedRoute, Data, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Course } from './../../_models/course';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ConfirmService } from '../../_services/confirm.service';
import { CourseService } from '../../_services/course.service';
import { ToastrService } from 'ngx-toastr';

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
    private _confirmService: ConfirmService,
    private _courseService: CourseService,
    private _toastr: ToastrService,
    private _router: Router) { }

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
        // console.log('ok');
        // console.log(course);
        this._courseService.delete(course._id).subscribe(
          (res_course) => {
            this._toastr.success('Success');
            this._courseService.all().subscribe(
              (courses: Course []) => {
                this.courses = courses;
              },
              (error) => {
                this._toastr.error(error);
              }
            );
          },
          (error) => {
            this._toastr.error(error);
          }
        );
      }).catch( () => {
        // Reject
        // console.log('no');
      });
  }

}
