import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Course } from '../../_models/course';
import { CourseService } from '../../_services/course.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  private sub: any;
  courses: Course [] = [];
  category: String = '';

  constructor(private _route: ActivatedRoute, private _courseService: CourseService) { }

  ngOnInit() {
    this.sub = this._route.params.subscribe(params => {
      this.category = params['name'];
   });

   this._route.data.subscribe(
    (data: Data) => {
      if (data.courses) {
        this.courses = data.courses;

        for (let course of this.courses) {
          this._courseService.getYoutubeInfo(course.youtube_ref).subscribe(
            (res_course: Course) => {
              course = res_course;
            }
          );
        }
      }
    });
  }

}
