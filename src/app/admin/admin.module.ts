import { MomentModule } from 'ngx-moment';
import { CourseResolver } from './courses/course.resolver';

import { NgPipesModule } from 'ngx-pipes';
import { CoursesComponent } from './courses/courses.component';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CourseNewComponent } from './courses/course-new/course-new.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgPipesModule,
    MomentModule
  ],
  declarations: [
    DashboardComponent,
    AdminComponent,
    CoursesComponent,
    CourseNewComponent],
  providers: [
    CourseResolver
  ]
})
export class AdminModule { }
