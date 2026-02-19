import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { User } from "@/components/login-client/login-client";
//import { Acceuil } from './pages/acceuil/acceuil';
import { AcceuilUser } from './pages/acceuilUser/acceuilUser';
import { ProduitInfo } from './pages/produit-info/produit-info';
import { AdminLogin } from './pages/admin-login/admin-login';
import { DashboardAdmin } from './pages/dashboard-admin/dashboard-admin';
import { RoleGuard } from './guards/role-guard';
import { BoutiqueUpdate } from './components/boutique-update/boutique-update';
import { BoutiqueDetail } from './components/boutique-detail/boutique-detail';
import { AjoutBoutique } from './pages/ajout-boutique/ajout-boutique';
import { Acceuil1 } from './pages/acceuil1/acceuil1';
import { Panier } from './components/panier/panier';
import {AdminUser} from './pages/admin-user/admin-user'; 


export const routes: Routes = [

  { path: '', redirectTo: 'acceuil-user', pathMatch: 'full' },
  {path: 'login', component: Login},
  { path: 'insert-user', component: User },
  { path: 'login-admin', component: AdminLogin },
  { path: 'acceuil-user', component: AcceuilUser },
  {
    path: 'user',
    canActivate: [RoleGuard],
    data: { roles: ['user'] },
    children: [
      { path: '', redirectTo: 'acceuil', pathMatch: 'full' },
      { path: 'acceuil1/:idBoutique', component: Acceuil1 },
      { path: 'acceuil-user', component: AcceuilUser },
      { path: 'produit/:id', component: ProduitInfo },
      {path:'panier', component: Panier}
    ]
  },

  {
    path: 'admin',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    children: [
      { path: 'dashboard', component: DashboardAdmin },
      { path: 'boutique/add', component: AjoutBoutique },
      { path: 'boutique/update/:id', component: BoutiqueUpdate },
      { path: 'boutique/detail/:id', component: BoutiqueDetail },
      { path: 'utilisateur', component: AdminUser },

    ]
  },
];
