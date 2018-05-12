import { NgxPageScrollModule } from 'ngx-page-scroll';
import { PagesComponent } from './pages.component';
import { NgPipesModule } from 'ngx-pipes';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxPageScrollModule,
    PagesRoutingModule
  ],
  declarations: [
    PagesComponent
  ]
})
export class PagesModule { }
