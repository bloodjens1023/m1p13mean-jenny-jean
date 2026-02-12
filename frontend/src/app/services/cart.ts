import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ProduitPanier {
  produit: string;   // ID du produit
  nom: string;
  prix: number;
  quantite: number;
  stock: number;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private panier: ProduitPanier[] = [];
  private panierSubject = new BehaviorSubject<ProduitPanier[]>([]);

  panier$ = this.panierSubject.asObservable();

  constructor() {
    const data = localStorage.getItem('panier');
    if (data) {
      this.panier = JSON.parse(data);
      this.panierSubject.next(this.panier);
      console.log(data)
    }
  }

  getNombreArticles(): number {
    return this.panier.reduce((acc, p) => acc + p.quantite, 0);
  }

  ajouterProduit(produit: ProduitPanier) {
    const exist = this.panier.find(p => p.produit === produit.produit);

    if (exist) {
      exist.quantite += produit.quantite;
    } else {
      this.panier.push(produit);
    }

    this.save();
  }

  supprimerProduit(id: string) {
    this.panier = this.panier.filter(p => p.produit !== id);
    this.save();
  }

  modifierQuantite(id: string, quantite: number) {
    const produit = this.panier.find(p => p.produit === id);
    if (produit) {
      produit.quantite = quantite;
      this.save();
    }
  }

  getTotal(): number {
    return this.panier.reduce((total, p) => total + (p.prix * p.quantite), 0);
  }

  viderPanier() {
    this.panier = [];
    this.save();
  }

  private save() {
    localStorage.setItem('panier', JSON.stringify(this.panier));
    this.panierSubject.next(this.panier);
  }
}
