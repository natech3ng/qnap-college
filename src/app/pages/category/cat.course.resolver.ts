import { CategoryService } from './../../_services/category.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Course } from '../../_models/course';
import { CourseService } from '../../_services/course.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CatCourseResolver implements Resolve<Course []> {
  constructor(private _courseService: CourseService, private _categoryService: CategoryService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Course []> | Promise<Course []> | Course [] {
    this._categoryService.increase(route.params.name);
    if(route.params.name)
      return this._courseService.allByCategory(route.params.name);
    else if(route.params.tag_name)
    return this._courseService.allByTag(route.params.tag_name);
  }
}
