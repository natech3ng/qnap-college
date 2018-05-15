import { MomentModule } from 'ngx-moment';
import { NgSelectModule } from '@ng-select/ng-select';

import { CourseResolver } from './courses/course.resolver';

import { NgPipesModule, UcFirstPipe } from 'ngx-pipes';
import { CoursesComponent } from './courses/courses.component';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CourseNewComponent } from './courses/course-new/course-new.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TagInputModule } from 'ngx-chips';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgPipesModule,
    MomentModule,
    FormsModule,
    TagInputModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule
  ],
  declarations: [
    DashboardComponent,
    AdminComponent,
    CoursesComponent,
    CourseNewComponent],
  providers: [
    CourseResolver,
    UcFirstPipe
  ]
})
export class AdminModule { }
