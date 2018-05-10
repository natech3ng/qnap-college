import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgPipesModule } from 'ngx-pipes';
import { MomentModule } from 'ngx-moment';

import { AppComponent } from './app.component';
import { CategoryService } from './_services/category.service';
import { IndexComponent } from './pages/index/index.component';
import { AppRoutingModule } from './app-routing.module';
import { CourseService } from './_services/course.service';
import { CourseResolver } from './pages/index/course.resolver';
import { CategoryResolver } from './pages/index/category.resolver';
import { DurationToTimePipe } from './_pipes/moment.duration.pipe';
import { CategoryComponent } from './pages/category/category.component';
import { CatCourseResolver } from './pages/category/cat.course.resolver';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    DurationToTimePipe,
    CategoryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgPipesModule,
    MomentModule
  ],
  providers: [CategoryResolver, CategoryService, CourseService, CourseResolver, CatCourseResolver],
  bootstrap: [AppComponent]
})
export class AppModule { }
