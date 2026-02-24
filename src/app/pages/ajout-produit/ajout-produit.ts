import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavShop } from "@/components/nav-shop/nav-shop";
import { BoutiqueService } from '@/services/boutique';
import { ProduitService } from '@/services/produit';
import { AuthService } from '@/services/auth';





export interface Produit {
  _id: number;
  nom: string;
  prix: number;
  stock: number;
  description?: string;
  image?: string;
  couleur?: string;
}
@Component({
  selector: 'app-ajout-produit',
  imports: [ CommonModule, FormsModule, RouterModule, CurrencyPipe, DatePipe, NavShop],
  templateUrl: './ajout-produit.html',
  styleUrl: './ajout-produit.css',
})


export class AjoutProduit implements OnInit {
  constructor (private produitService: ProduitService,
    private authService : AuthService,
    private boutiqueService : BoutiqueService){}
  boutiqueNom = 'Ma Boutique';
  today = new Date();
  searchTerm = '';

  // Modal états
  modalOuvert = false;
  modalSuppressionOuvert = false;
  modeEdition = false;
  produitASupprimer: Produit | null = null;

  // Formulaire
  produitForm: Partial<Produit> = {};

  // Couleurs auto pour les avatars
  private couleurs = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

  // Données (à remplacer par appels API)
  loadProduits(id : string) {
    this.produitService.getProduitByIDBoutique(id).subscribe({
      next: (data) => {
        this.produits = data;

      },
      error: (err) => {
        console.error('Erreur lors du chargement des produits', err);
      }
    });
  }
  produits: Produit[] = [];

  produitsFiltres: Produit[] = [];


  get produitsEnStock(): number {
    return this.produits.filter(p => p.stock > 0).length;
  }

  get produitsStockFaible(): number {
    return this.produits.filter(p => p.stock > 0 && p.stock <= 5).length;
  }

  get valeurStock(): number {
    return this.produits.reduce((sum, p) => sum + (p.prix * p.stock), 0);
  }

  ngOnInit(): void {


    this.generer();
  }
  generer(): void {

  // Copie des produits
  this.produitsFiltres = [...this.produits];

  const owner = this.authService.user()?.id;

  if (!owner) {
    console.error('Owner non trouvé');
    return;
  }

  this.boutiqueService.getBoutiqueByIdOwner(owner).subscribe({

    next: (response: any) => {

      console.log('Réponse API boutique :', response);

      // ⚠️ Si le backend renvoie { boutiques: [...] }
      const boutiques = Array.isArray(response) ? response : response?.boutiques;

      if (boutiques && boutiques.length > 0) {

        const boutiqueId = boutiques[0]._id;
        console.log('Boutique ID:', boutiqueId);

        this.loadProduits(boutiqueId);

      } else {
        console.warn('Aucune boutique trouvée pour cet owner');
      }
    },

    error: (error) => {
      console.error('Erreur API boutique :', error);
    }

  });
}

  // ============ MODAL AJOUT / MODIFICATION ============

  ouvrirModal(produit?: Produit): void {
    if (produit) {
      this.modeEdition = true;
      this.produitForm = { ...produit };
    } else {
      this.modeEdition = false;
      this.produitForm = { stock: 0, prix: 0 };
    }
    this.modalOuvert = true;
  }

  fermerModal(): void {
    this.modalOuvert = false;
    this.produitForm = {};

  }

  sauvegarderProduit(): void {


    if (this.modeEdition) {
      // Modification
      const index = this.produits.findIndex(p => p._id === this.produitForm._id);
      if (index !== -1) {
        this.produits[index] = { ...this.produits[index], ...this.produitForm } as Produit;
      }
      // TODO: appel API PUT /produits/:id
    } else {
      // Ajout
      const nouveauProduit: Produit = {
        _id: Date.now(),
        nom: this.produitForm.nom!,
        prix: this.produitForm.prix!,
        stock: this.produitForm.stock!,
        description: this.produitForm.description,
        image: this.produitForm.image,
        couleur: this.couleurs[Math.floor(Math.random() * this.couleurs.length)]
      };
      this.produits.push(nouveauProduit);
      // TODO: appel API POST /produits
    }


    this.fermerModal();
  }

  // ============ SUPPRESSION ============

  confirmerSuppression(produit: Produit): void {
    console.log(produit._id)
    this.produitASupprimer = produit;
    this.modalSuppressionOuvert = true;
  }

  annulerSuppression(): void {
    this.modalSuppressionOuvert = false;
    this.produitASupprimer = null;
  }

  supprimerProduit(): void {
    if (this.produitASupprimer) {
      // TODO: appel API DELETE /produits/:id
        this.produitService.deleteProduit(this.produitASupprimer._id.toString()).subscribe({
        next: (data) => {
          console.log('supprimer produit');
          this.generer();
        },
        error: (err) => {
          console.error('Erreur lors du chargement des produits', err);
        }
      });
      }
    this.annulerSuppression();
  }

  // ============ EXPORT ============

  exporterProduits(): void {
    const headers = ['ID', 'Nom', 'Prix (AR)', 'Stock'];
    const rows = this.produitsFiltres.map(p =>
      [p._id, p.nom, p.prix, p.stock].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `produits_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
