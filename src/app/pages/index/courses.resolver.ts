import { CourseDoc } from './../../_models/document';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Course } from '../../_models/course';
import { CourseService } from '../../_services/course.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CoursesResolver implements Resolve<CourseDoc> {
  constructor(private _courseService: CourseService, private _router: Router) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<CourseDoc> | Promise<CourseDoc> | CourseDoc {
    const cs = localStorage.getItem('currentDisplay') || 'Latest';
    let cs_value;
    for (const option of this._courseService.options) {
      if (option['name'] === cs) {
        cs_value = option['value'];
        break;
      }
    }
    return this._courseService.all(6, cs_value).catch(err => {
      this._router.navigate(['/maintenance']);
      return [];
    });
  }
}
