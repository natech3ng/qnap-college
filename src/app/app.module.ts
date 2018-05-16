import { NgxScreensizeModule } from './modules/ngx-screensize/index';
import { AuthService } from './auth/_services/auth.service';
import { AdminModule } from './admin/admin.module';
import { PagesModule } from './pages/pages.module';
import { AuthModule } from './auth/auth.module';
import { ModalService } from './_services/modal.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgPipesModule } from 'ngx-pipes';
import { MomentModule } from 'ngx-moment';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { NgcCookieConsentModule, NgcCookieConsentConfig } from 'ngx-cookieconsent';
import { ResponsiveModule } from 'ngx-responsive';
import { ToastrModule } from 'ngx-toastr';

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
import { SearchComponent } from './pages/search/search.component';
import { SearchResolver } from './pages/search/search.resolver';
import { SearchService } from './_services/search.service';
import { SafePipe } from './_pipes/safe.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmService } from './_services/confirm.service';

const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: 'college.qnap.com'
  },
  palette: {
    popup: {
      background: '#000'
    },
    button: {
      background: '#f1d600'
    }
  },
  revokable: true,
  content: {
    dismiss: 'Agree'
  },
  layout: 'cc-qnap',
  layouts: {
    'cc-qnap': '<span id="cookieconsent:desc" class="cc-message">{{message}}</span>{{dismiss}}',
  },
  elements: {
    message: 'This site uses cookies in order to improve ' +
      'your user experience and to provide content tailored' +
      'specifically to your interests. By continuing to browse our site you agree to our use of cookies, <a href="//www.qnap.com/go/privacy-notice" target="_blank">Data Privacy Notice</a> and <a href="//www.qnap.com/terms-of-use" target="_blank">Terms of Use / Service</a>',
  }
};


@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    DurationToTimePipe,
    CategoryComponent,
    SearchComponent,
    SafePipe
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgPipesModule,
    MomentModule,
    NgcCookieConsentModule.forRoot(cookieConfig),
    AuthModule,
    PagesModule,
    AdminModule,
    DeviceDetectorModule.forRoot(),
    NgxScreensizeModule,
    NgbModule.forRoot(),
    ToastrModule.forRoot()
  ],
  providers: [
    CategoryResolver,
    CategoryService,
    CourseService,
    CourseResolver,
    CatCourseResolver,
    SearchResolver,
    SearchService,
    ModalService,
    AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {}
