import { Routes } from '@angular/router';
import { Login } from './components/login/login';

export const routes: Routes = [
  {path: 'Login', component: Login},
  { path: '', redirectTo: 'Login', pathMatch: 'full' }
];
