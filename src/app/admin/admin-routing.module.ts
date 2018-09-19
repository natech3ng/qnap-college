import { CourseNewComponent } from './courses/course-new/course-new.component';
import { CoursesComponent } from './courses/courses.component';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseResolver } from './courses/course.resolver';
import { CategoryResolver } from '../pages/index/category.resolver';
import { CourseEditComponent } from './courses/course-edit/course-edit.component';
import { SingleCourseResolver } from './courses/course-edit/single.course.resolver';
import { UsersComponent } from './users/users.component';
import { UserNewComponent } from './users/user-new/user-new.component';
import { UsersResolver } from './users/users.resolver';
import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'courses',
        component: CoursesComponent,
        resolve: { coursedoc: CourseResolver}
      },
      {
        path: 'course/new',
        component: CourseNewComponent,
        resolve: { categories: CategoryResolver}
      },
      {
        path: 'course/:id/edit',
        component: CourseEditComponent,
        resolve: { categories: CategoryResolver, course: SingleCourseResolver}
      },
      {
        path: 'users',
        component: UsersComponent,
        resolve: { users: UsersResolver }
      },
      {
        path: 'user/new',
        component: UserNewComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
