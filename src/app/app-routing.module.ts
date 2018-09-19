import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { PagesComponent } from './pages/pages.component';
import { AuthGuard } from './auth/_guards/auth.guard';
import { Routes, RouterModule  } from '@angular/router';

import { IndexComponent } from './pages/index/index.component';
import { CategoryResolver } from './pages/index/category.resolver';
import { CategoryComponent } from './pages/category/category.component';
import { CatCourseResolver } from './pages/category/cat.course.resolver';
import { SearchComponent } from './pages/search/search.component';
import { SearchResolver } from './pages/search/search.resolver';
import { CourseComponent } from './pages/course/course.component';
import { CoursesResolver } from './pages/index/courses.resolver';
import { MaintenanceComponent } from './pages/maintenance/maintenance.component';

const routes: Routes = [
  // {
  //   path: '', component: PagesComponent,
  //   children: [
  //     {
  //       path: '', component: IndexComponent,
  //       resolve: { courses: CourseResolver, categories: CategoryResolver}
  //     },
  //     {
  //       path: 'category/:name', component: CategoryComponent,
  //       resolve: { courses: CatCourseResolver }
  //     },
  //     {
  //       path: 'search/:keywords', component: SearchComponent,
  //       resolve: { courses: SearchResolver }
  //     }
  //   ]
  // },
  // {
  //   path: 'admin', component: AdminComponent,
  //   children: [
  //     {
  //       path: '',
  //       component: DashboardComponent, canActivate: [AuthGuard]
  //     }
  //   ]
  // },
  // {
  //   path: 'login', component: AuthComponent
  // },
  // {
  //   path: 'signup', component: AuthComponent
  // },
  // {
  //   path: '**',
  //   component: NotFoundComponent
  // },
  {
    path: '', loadChildren: './pages/pages.module#PagesModule',
  },
  {
    path: 'login', loadChildren: './auth/auth.module#AuthModule'
  },
  {
    path: 'admin', loadChildren: './admin/admin.module#AdminModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'maintenance', component: MaintenanceComponent
  },
  {
    path: '**', component: NotFoundComponent
  }
];

export const AppRoutingModule = RouterModule.forRoot(routes, {});
