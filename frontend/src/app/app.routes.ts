import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Acceuil } from './pages/acceuil/acceuil';
import { ProduitInfo } from './pages/produit-info/produit-info';


export const routes: Routes = [
    {path: 'login', component: Login},
    {path: 'acceuil', component: Acceuil},
    {path: 'produit/:id', component: ProduitInfo},
  { path: '', redirectTo: 'acceuil', pathMatch: 'full' }
];
