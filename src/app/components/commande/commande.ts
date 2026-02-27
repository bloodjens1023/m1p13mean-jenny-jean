import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '@/services/auth';
import { CommandeService } from '@/services/commande';
import { FormsModule } from '@angular/forms';
import {  Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import Swal from 'sweetalert2';
import { BoutiqueService } from '@/services/boutique';
@Component({
  selector: 'app-commande',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './commande.html',
  styleUrl: './commande.css',
})
export class Commandess {
  router = inject(Router);

  auth = inject(AuthService);
  commandeService = inject(CommandeService);
  boutiqueService = inject(BoutiqueService);

  commandes: any[] = [];
  idBoutique!: string;

  ngOnInit() {
    const owner = this.auth.user()?.id;
    if (!owner) {
      console.error('Owner non trouvé');
      return;
    }

    this.boutiqueService.getBoutiqueByIdOwner(owner).subscribe({

      next: (boutiques) => {
        if (boutiques && boutiques.length > 0) {
          this.idBoutique = boutiques[0]._id;
          this.commandesParBoutique();
          } else {
            console.warn('Aucune boutique trouvée pour cet owner');
          }
        },
        error: (err) => {
          console.error('Erreur récupération boutique', err);
        }
      });
    }
    commandesParBoutique() {
      this.commandeService.commandesParBoutique(this.idBoutique)
        .subscribe({
          next: (res: any[]) => {
            console.log('Réponse API commandes :', res);
            this.commandes = res;
          },
          error: (err) => {
            console.error('Erreur chargement commandes', err);
            this.commandes = [];
          }
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
  changerStatut(id: string, nouveauStatut: string): void {
    this.commandeService.modifierStatutCommande(id, nouveauStatut)
      .subscribe({
        next: () => {
          Swal.fire('Succès', 'Statut mis à jour', 'success');
          this.commandesParBoutique();
        },
        error: (err) => {
          Swal.fire(
            'Erreur',
            err.error?.message || 'Erreur serveur',
            'error'
          );
        }
      });
  }
  confirmToggle(commande: any): void {
    if (!commande || !commande._id) {
      console.error('Commande invalide', commande);
      return;
    }
  
    const nouveauStatut =
      commande.statut === 'Confirmée' ? 'Annulée' : 'Confirmée';
  
    Swal.fire({
      title: 'Confirmation',
      text:
        nouveauStatut === 'Annulée'
          ? 'Voulez-vous annuler cette commande ?'
          : 'Voulez-vous confirmer cette commande ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#dc2626'
    }).then((result) => {
      if (result.isConfirmed) {
        this.changerStatut(commande._id, nouveauStatut);
      }
    });
  }
}