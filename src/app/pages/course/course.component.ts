import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Course } from '../../_models/course';
import { CourseService } from '../../_services/course.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, OnDestroy {

  sub: Subscription;
  routeSub: Subscription;
  course: Course;
  courses: Course [];
  youtubeSrc;
  keywords;
  constructor(private _route: ActivatedRoute, private _courseService: CourseService, private _router: Router) {
    this._courseService.all(4, 'watched').subscribe(
      (courses: Course []) => {
        this.courses = courses;
      },
      (error) => {
        console.log('Something went wrong');
      }
    );

    this.keywords = '';
  }

  ngOnInit() {
    this.sub = this._route.params.subscribe(params => {
    });

    this.routeSub = this._route.data.subscribe(
      (data: Data) => {
        if (data.course) {
          this.course = data.course;
          this.youtubeSrc = 'https://www.youtube.com/embed/' + this.course.youtube_ref;
          this.course.tags = this.course.keywords.split(' ');
        }
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.routeSub.unsubscribe();
  }

  onSubmit(f: NgForm) {
    this._router.navigate(['/search', f.value.keywords]);
  }

}
