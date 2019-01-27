import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { CreatePasswordComponent } from './create.password/create.password.component';

const routes: Routes = [
    {
      path: 'login', component: AuthComponent
    },
    {
      path: 'signup', component: AuthComponent
    },
    { 
      path: 'create-password', component: CreatePasswordComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
