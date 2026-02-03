import { NgModule } from '@angular/core';
import { RouterModule,Router } from '@angular/router';
import { Login } from './components/login/login';
import { Acceuil } from './pages/acceuil/acceuil';


<<<<<<< HEAD
export const routes: Router = [
  {path: 'Login', component: Login},
  { path: '', redirectTo: 'Login', pathMatch: 'full' }
=======
export const routes: Routes = [
    {path: 'login', component: Login},
    {path: 'acceuil', component: Acceuil},
  { path: '', redirectTo: 'acceuil', pathMatch: 'full' }
>>>>>>> upstream/main
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }