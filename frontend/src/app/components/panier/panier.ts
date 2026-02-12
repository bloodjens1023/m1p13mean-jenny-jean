import { AuthService } from '@/services/auth';
import { CartService, ProduitPanier } from '@/services/cart';
import { ProduitService } from '@/services/produit';
import { CommandeService, Commande } from '@/services/commande'; // service pour API commande
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from "@angular/router";

@Component({
  selector: 'app-panier',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './panier.html',
  styleUrl: './panier.css',
})
export class Panier {
  auth = inject(AuthService);
  router = inject(Router);

  produits: ProduitPanier[] = [];
  total: number = 0;
  id_User: string | undefined;

  // Livraison
  dateLivraison: string = '';
  modeLivraison: string = 'Livraison';
  adresseTexte: string = '';

  constructor(
    private cartService: CartService,
    private produitService: ProduitService,
    private commandeService: CommandeService
  ) {}

  ngOnInit() {
    // Récupérer l'ID de l'utilisateur connecté
    const user = this.auth.user();
    this.id_User = user?.id; // ou user?._id selon ton AuthService
    console.log('Utilisateur connecté ID :', this.id_User);

    // S'abonner au panier
    this.cartService.panier$.subscribe(data => {
      this.produits = data;
      this.total = this.cartService.getTotal();
    });
  }

  modifierQuantite(id: string, event: any) {
    const quantite = Number(event.target.value);
    this.cartService.modifierQuantite(id, quantite);
  }

  supprimer(id: string) {
    this.cartService.supprimerProduit(id);
  }

  getQuantites(stock: number): number[] {
    return stock > 0 ? Array.from({ length: stock }, (_, i) => i + 1) : [];
  }

  trackByFn(index: number, item: number) {
    return item; // Angular ne recrée les <option> que si la valeur change
  }

  // 🔥 Fonction commander
  commander() {
    if (!this.id_User) {
      alert("Vous devez être connecté pour passer une commande !");
      return;
    }

    if (this.produits.length === 0) {
      alert("Votre panier est vide !");
      return;
    }

    const commande: Commande = {
      acheteur: this.id_User,
      produits: this.produits.map(p => ({
        produit: p.produit,
        quantite: p.quantite
      })),
      total: this.total,
      dateLivraison: this.dateLivraison || new Date(),
      modeLivraison: this.modeLivraison,
      adresseLivraison: {
        adresseTexte: this.adresseTexte
      }
    };

    this.commandeService.passerCommande(commande).subscribe({
      next: () => {
        alert('Commande envoyée ✅');
        this.cartService.viderPanier();
        this.router.navigate(['/commande/suivi']); // rediriger vers suivi commande
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de la commande, veuillez réessayer.');
      }
    });
  }
}
