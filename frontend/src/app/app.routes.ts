import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { User } from "@/components/login-client/login-client";
import { Acceuil } from './pages/acceuil/acceuil';
import { AcceuilUser } from './pages/acceuilUser/acceuilUser';
import { ProduitInfo } from './pages/produit-info/produit-info';
import { AdminLogin } from './pages/admin-login/admin-login';
import { DashboardAdmin } from './pages/dashboard-admin/dashboard-admin';
import { RoleGuard } from './guards/role-guard';
import { BoutiqueUpdate } from './components/boutique-update/boutique-update';
import { BoutiqueDetail } from './components/boutique-detail/boutique-detail';
import { AjoutBoutique } from './pages/ajout-boutique/ajout-boutique';
import { AdminUser } from './pages/admin-user/admin-user';


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
       {path: 'user', component: AdminUser},
       {path: 'boutique/add', component: AjoutBoutique},

       {path: 'boutique/update/:id', component: BoutiqueUpdate},
       {path: 'boutique/detail/:id', component: BoutiqueDetail},
    ]
  },
  //   {path:'insertUser',component:User},
  //   {path: 'login', component: Login},
    {path: 'acceuil', component: Acceuil},
  //   {path: 'acceuilUser', component: AcceuilUser},
  //   {path: 'produit/:id', component: ProduitInfo},
  // { path: '', redirectTo: 'insertUser', pathMatch: 'full' },

];
