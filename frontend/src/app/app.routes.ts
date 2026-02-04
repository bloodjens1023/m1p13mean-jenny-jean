import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Acceuil } from './pages/acceuil/acceuil';
import { ProduitInfo } from './pages/produit-info/produit-info';
import { AdminLogin } from './pages/admin-login/admin-login';
import { DashboardAdmin } from './pages/dashboard-admin/dashboard-admin';
import { RoleGuard } from './guards/role-guard';


export const routes: Routes = [
    { path: '', redirectTo: 'acceuil', pathMatch: 'full' },
    {path: 'login', component: Login},
    {path: 'admin', component: AdminLogin},



     {
    path: 'user',
    canActivate: [RoleGuard],
    data: { roles: ['user'] },
    children: [
       //path a changer a la fin
       { path: '', redirectTo: 'acceuil', pathMatch: 'full' },
       {path: 'acceuil', component: Acceuil},
       {path: 'produit/:id', component: ProduitInfo},
    ]
  },
  {
    path: 'admin',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    children: [
       //path a changer a la fin
       {path: 'dashboard', component: DashboardAdmin},
    ]
  },
];
