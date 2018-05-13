import { NgxPageScrollModule } from 'ngx-page-scroll';
import { PagesComponent } from './pages.component';
import { NgPipesModule } from 'ngx-pipes';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { FormsModule } from '@angular/forms';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxPageScrollModule,
    PagesRoutingModule
  ],
  declarations: [
    PagesComponent,
    NotFoundComponent
  ]
})
export class PagesModule { }
