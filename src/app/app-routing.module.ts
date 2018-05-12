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
    path: '', loadChildren: './pages/pages.module#PagesModule',
  },
  {
    path: 'login', loadChildren: './auth/auth.module#AuthModule'
  },
  {
    path: 'admin', loadChildren: './admin/admin.module#AdminModule'
  },
  {
    path: '**', loadChildren: './pages/pages.module#PagesModule'
  }
];

export const AppRoutingModule = RouterModule.forRoot(routes, {});
