import { Component, OnInit, OnDestroy } from '@angular/core';
import { Course } from '../../../_models/course';
import { ActivatedRoute, Data } from '@angular/router';
import { Category } from '../../../_models/category';
import { Subscription } from 'rxjs';
import { UcFirstPipe } from 'ngx-pipes';
import { NgForm } from '@angular/forms';
import { ConfirmService } from '../../../_services/confirm.service';

@Component({
  selector: 'app-course-edit',
  templateUrl: '../shared/course-new.component.html',
  styleUrls: ['./course-edit.component.scss']
})
export class CourseEditComponent implements OnInit, OnDestroy {

  app = 'edit course';
  paramSub: Subscription;
  dataSub: Subscription;
  course: Course;
  categories: Category [];
  constructor(
    private _route: ActivatedRoute,
    private ucfirstPipe: UcFirstPipe,
    private _confirmService: ConfirmService) {
    this.paramSub = this._route.params.subscribe(
      (params) => {
        console.log(params);
      }
    );

    this.dataSub = this._route.data.subscribe(
      (data: Data) => {
        // console.log(data);
        this.course = data.course;
        this.course.tags = new Array();
        if (this.course['keywords']) {
          this.course['tags'] = this.course['keywords'].split(' ');
        }

        setTimeout( () => {
          this.categories = data.categories;

          for (const category of this.categories) {
            category.name = this.ucfirstPipe.transform(category.name);
          }
        }, 0);
      }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.paramSub.unsubscribe();
    this.dataSub.unsubscribe();
  }

  onSubmit(f: NgForm) {
    console.log('onSubmit');
    this._confirmService.open('Do you want to submit?').then(
      () => {
        console.log('ok');
      }).catch( () => {
        // Reject
        console.log('no');
    });
  }
}
