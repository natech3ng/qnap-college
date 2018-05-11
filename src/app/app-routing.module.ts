import { Routes, RouterModule  } from '@angular/router';

import { IndexComponent } from './pages/index/index.component';
import { CourseResolver } from './pages/index/course.resolver';
import { CategoryResolver } from './pages/index/category.resolver';
import { CategoryComponent } from './pages/category/category.component';
import { CatCourseResolver } from './pages/category/cat.course.resolver';
import { SearchComponent } from './pages/search/search.component';
import { SearchResolver } from './pages/search/search.resolver';

const routes: Routes = [
  {
    path: '', component: IndexComponent,
    resolve: { courses: CourseResolver, categories: CategoryResolver }
  },
  {
    path: 'category/:name', component: CategoryComponent,
    resolve: { courses: CatCourseResolver }
  },
  {
    path: 'search/:keywords', component: SearchComponent,
    resolve: { courses: SearchResolver }
  }
];

export const AppRoutingModule = RouterModule.forRoot(routes, {});
