import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Acceuil } from './pages/acceuil/acceuil';


export const routes: Routes = [
    {path: 'login', component: Login},
    {path: 'acceuil', component: Acceuil},
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
