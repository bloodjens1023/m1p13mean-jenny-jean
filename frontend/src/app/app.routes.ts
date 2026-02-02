import { NgModule } from '@angular/core';
import { RouterModule,Router } from '@angular/router';
import { Login } from './components/login/login';

export const routes: Router = [
  {path: 'Login', component: Login},
  { path: '', redirectTo: 'Login', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }