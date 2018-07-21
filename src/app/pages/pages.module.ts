import { NgxPageScrollModule } from 'ngx-page-scroll';
import { PagesComponent } from './pages.component';
import { NgPipesModule } from 'ngx-pipes';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { FormsModule } from '@angular/forms';
import { NotFoundComponent } from './not-found/not-found.component';
import { SafePipe } from '../_pipes/safe.pipe';
import { RunScriptsDirective } from '../_directives/run.scripts.directives';
import { CourseComponent } from './course/course.component';
import { MomentModule } from 'ngx-moment';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxPageScrollModule,
    PagesRoutingModule,
    MomentModule,
    NgPipesModule,
    InfiniteScrollModule
  ],
  declarations: [
    PagesComponent,
    NotFoundComponent,
    RunScriptsDirective,
    CourseComponent,
    SafePipe
  ]
})
export class PagesModule { }
