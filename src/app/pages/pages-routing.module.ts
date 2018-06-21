import { PagesComponent } from './pages.component';
import { SearchResolver } from './search/search.resolver';
import { SearchComponent } from './search/search.component';
import { CatCourseResolver } from './category/cat.course.resolver';
import { CategoryComponent } from './category/category.component';
import { CoursesResolver } from './index/courses.resolver';
import { IndexComponent } from './index/index.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryResolver } from './index/category.resolver';
import { CourseComponent } from './course/course.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '', component: IndexComponent,
        resolve: { courses: CoursesResolver, categories: CategoryResolver}
      },
      {
        path: 'category/:name', component: CategoryComponent,
        resolve: { courses: CatCourseResolver }
      },
      {
        path: 'search/:keywords', component: SearchComponent,
        resolve: { courses: SearchResolver }
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
