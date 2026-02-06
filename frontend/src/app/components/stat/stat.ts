import { AuthService } from '@/services/auth';
import { BoutiqueService } from '@/services/boutique';
import { UserService } from '@/services/user';
import { CommonModule } from '@angular/common';
import { Component, inject, OnChanges, SimpleChanges } from '@angular/core';
import { BoutiqueList } from "../boutique-list/boutique-list";
import { NavbarAdmin } from "../navbar-admin/navbar-admin";
@Component({
  selector: 'app-stat',
  imports: [CommonModule, BoutiqueList, NavbarAdmin],
  templateUrl: './stat.html',
  styleUrl: './stat.css',
})
export class Stat {
  boutiques: any[] = [];
  boutique_actif: number = 0;
  boutique_total: number = 0;
  user_total: number = 0;
  user: any[] = [];
  auth = inject(AuthService);
  constructor(private boutiqueService: BoutiqueService,private userService: UserService) {
    setInterval(() => {
    this.generer();
  }, 500);
  }

  ngOnInit() {
    this.generer();
    // this.nbClientActif();
  }





  generer(){

    this.nbBoutiquesActif();
  }
  logout(){
    this.auth.logout();
  }

  nbBoutiquesActif() {
    this.boutiqueService.getBoutique().subscribe({
         next: (res) => {
            this.boutiques = res;
            // console.log('Produits récupérés :', this.boutiques);
            this.boutique_actif = this.boutiques.filter(b => b.active).length;
            this.boutique_total = this.boutiques.length;
         },
         error: (err) => {
            console.error('Erreur lors de la récupération des produits :', err);
         }
      });
  }


  // //en attente d'une api pour les clients actifs
  // nbClientActif(){
  //   this.userService.getUser().subscribe({
  //         next: (res) => {
  //           this.user = res;
  //           console.log('Users récupérés :', this.user);
  //           this.user_total = this.user.filter(u => u.role === 'USER').length;
  //         },
  //         error: (err) => {
  //           console.error('Erreur lors de la récupération des users :', err);
  //         }
  //     });

  // }

}
