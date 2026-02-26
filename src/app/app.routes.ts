import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { User } from "@/components/login-client/login-client";
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
import { DashboardBoutique } from './pages/dashboard-boutique/dashboard-boutique';
import { LoginBoutique } from './components/login-boutique/login-boutique';
import { SignBoutique } from './components/sign-boutique/sign-boutique';
import { HistoriqueCommande } from './components/historique-commande/historique-commande';
import { Commandess } from './components/commande/commande';
import { HomeRedirect } from './components/home-redirect/home-redirect';
import { AjoutProduit } from './pages/ajout-produit/ajout-produit';


export const routes: Routes = [

  // ── Page d'accueil : redirige selon le rôle ──────────────
  { path: '', component: HomeRedirect },

  // ── Auth ─────────────────────────────────────────────────
  { path: 'login',       component: Login       },
  { path: 'login-admin', component: AdminLogin  },
  { path: 'login-shop',  component: LoginBoutique },
  { path: 'sign-shop',   component: SignBoutique  },
  { path: 'insert-user', component: User         },
  { path: 'commande', component: Commandess         },

  // ── Public ───────────────────────────────────────────────
  { path: 'acceuil-user', component: AcceuilUser },

  // ── Espace USER ──────────────────────────────────────────
  {
    path: 'user',
    canActivate: [RoleGuard],
    data: { roles: ['user'] },
    children: [
      { path: '',                        redirectTo: 'acceuil-user', pathMatch: 'full' },
      { path: 'acceuil1/:idBoutique',    component: Acceuil1     },
      { path: 'acceuil-user',            component: AcceuilUser  },
      { path: 'produit/:id',             component: ProduitInfo  },
      { path: 'panier',                  component: Panier       },
      { path: 'historique-commande', component: HistoriqueCommande},
    ]
  },

  // ── Espace SHOP ──────────────────────────────────────────
  {
    path: 'shop',
    canActivate: [RoleGuard],
    data: { roles: ['shop'] },
    children: [
      { path: '',          redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardBoutique },
      { path: 'produit', component: AjoutProduit },
    ]
  },

  // ── Espace ADMIN ─────────────────────────────────────────
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

      { path: 'dashboard',            component: DashboardAdmin  },
      { path: 'boutique/add',         component: AjoutBoutique   },
      { path: 'boutique/update/:id',  component: BoutiqueUpdate  },
      { path: 'boutique/detail/:id',  component: BoutiqueDetail  },
    ]
  },

  // ── Fallback ─────────────────────────────────────────────
  { path: '**', redirectTo: '' },

];
