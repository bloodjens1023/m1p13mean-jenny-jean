import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '@/services/auth';
import { CommandeService } from '@/services/commande';
import { FormsModule } from '@angular/forms';
import {  Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-historique-commande',
  standalone: true,
  imports: [FormsModule,CommonModule, RouterLink],
  templateUrl: './historique-commande.html',
  styleUrl: './historique-commande.css',
})
export class HistoriqueCommande {
  router = inject(Router);

  auth = inject(AuthService);
  commandeService = inject(CommandeService);
  loading : boolean = false;
  commandes: any[] = [];
  acheteur!: string;

  ngOnInit() {
    this.loading = true;
    const user = this.auth.user();

    if (!user || !user.id) {
      return;
    }

    this.acheteur = user.id;

  this.loadHistorique();
  }

  loadHistorique() {
    this.commandeService.historiqueCommandes(this.acheteur)
      .subscribe(res => {
        this.commandes = res.historique;
        this.loading = false
      });

  }
  imprimerFacture(commandeId: string) {
    const url = this.commandeService.imprimerFacture(commandeId);
    window.open(url, '_blank');
  }

  totalQuantite(c: any): number {
    return c.produits.reduce((sum: number, p: any) => sum + p.quantite, 0);
  }

  nomsProduits(c: any): string {
    return c.produits.map((p: any) => p.produit?.nom).join(', ');
  }
}
