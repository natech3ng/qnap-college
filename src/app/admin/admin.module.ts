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
import { ConfirmService } from '../_services/confirm.service';
import { ModalModule } from 'ngx-modialog';
import { BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';
import { CourseEditComponent } from './courses/course-edit/course-edit.component';
import { SingleCourseResolver } from './courses/course-edit/single.course.resolver';

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
    NgbModule,
    ModalModule.forRoot(),
    BootstrapModalModule
  ],
  declarations: [
    DashboardComponent,
    AdminComponent,
    CoursesComponent,
    CourseNewComponent,
    CourseEditComponent],
  providers: [
    CourseResolver,
    UcFirstPipe,
    ConfirmService,
    SingleCourseResolver
  ]
})
export class AdminModule { }
