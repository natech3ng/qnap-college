import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Course } from '../../_models/course';
import { CourseService } from '../../_services/course.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CoursesResolver implements Resolve<Course []> {
  constructor(private _courseService: CourseService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Course []> | Promise<Course []> | Course [] {
    const cs = localStorage.getItem('currentDisplay') || 'Latest';
    let cs_value;
    for (const option of this._courseService.options) {
      if (option['name'] === cs) {
        cs_value = option['value'];
        break;
      }
    }
    return this._courseService.all(6, cs_value);
  }
}
