import { CourseDoc } from './../../_models/document';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { Observable, throwError } from 'rxjs';
// import { Course } from '../../_models/course';
import { CourseService } from '../../_services/course.service';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CoursesResolver implements Resolve<CourseDoc> {
  constructor(
    private _courseService: CourseService,
    private _router: Router,
    @Inject(PLATFORM_ID) private platformId: Object) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<CourseDoc> | Promise<CourseDoc> | CourseDoc {
    let cs = 'Latest';
    if (isPlatformBrowser(this.platformId)) {
      cs = localStorage.getItem('currentDisplay') || 'Latest';
    }
    
    let cs_value;
    let promise;
    for (const option of this._courseService.options) {
      if (option['name'] === cs) {
        cs_value = option['value'];
        break;
      }
    }

    let currentUser = localStorage.getItem('currentUser');

    if (currentUser !== null && typeof cs_value === 'undefined') {
      // console.log('favorite')
      promise = this._courseService.getFavoritedCourses(6)
    } else {
      // console.log('not favorite')
      if (typeof cs_value === 'undefined') {
        cs_value = 'publishedDate';
      }
      console.log(cs_value)
      promise = this._courseService.all(6, cs_value) ;
    }
    return promise.pipe(catchError(err => {
      this._router.navigate(['/maintenance']);
      return throwError(err);
    }));
  }
}
