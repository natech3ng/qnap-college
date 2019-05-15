import { ConfirmationComponent } from './auth/verification/confirmation';
// import { MetaGuard } from '@ngx-meta/core';
import { NotFoundComponent } from './pages/not-found/not-found.component';
// import { AuthComponent } from './auth/auth.component';
// import { DashboardComponent } from './admin/dashboard/dashboard.component';
// import { AdminComponent } from './admin/admin.component';
// import { PagesComponent } from './pages/pages.component';
import { AuthGuard } from './auth/_guards/auth.guard';
import { Routes, RouterModule  } from '@angular/router';

// import { IndexComponent } from './pages/index/index.component';
// import { CategoryResolver } from './pages/index/category.resolver';
// import { CategoryComponent } from './pages/category/category.component';
// import { CatCourseResolver } from './pages/category/cat.course.resolver';
// import { SearchComponent } from './pages/search/search.component';
// import { SearchResolver } from './pages/search/search.resolver';
// import { CourseComponent } from './pages/course/course.component';
// import { CoursesResolver } from './pages/index/courses.resolver';
// import { MaintenanceComponent } from './pages/maintenance/maintenance.component';
import { VerificationComponent } from './auth/verification/verification.component';
import { CreatePasswordComponent } from './auth/create.password/create.password.component';

const routes: Routes = [
  {
    // path: '', component: PagesComponent
    path: '',
    loadChildren: './pages/pages.module#PagesModule',
  },
  {
    path: 'login', loadChildren: './auth/auth.module#AuthModule'
  },
  {
    path: 'admin', loadChildren: './admin/admin.module#AdminModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'user/verification/:id', component: VerificationComponent
  },
  {
    path: 'user/create-password/:id', component: CreatePasswordComponent
  },
  {
    path: 'confirmation', component: ConfirmationComponent
  },
  {
    path: '**', component: NotFoundComponent
  }
];

export const AppRoutingModule = RouterModule.forRoot(routes, {});
