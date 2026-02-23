import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '@/services/auth';
import { CommandeService } from '@/services/commande';
import { FormsModule } from '@angular/forms';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-historique-commande',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './historique-commande.html',
  styleUrl: './historique-commande.css',
})
export class HistoriqueCommande {
  router = inject(Router);

  auth = inject(AuthService);
  commandeService = inject(CommandeService);

  commandes: any[] = [];
  acheteur!: string;

  ngOnInit() {
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