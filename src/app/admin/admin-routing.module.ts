import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'index',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
