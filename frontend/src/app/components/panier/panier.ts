import { AuthService } from '@/services/auth';
import { CartService, ProduitPanier } from '@/services/cart';
import { ProduitService } from '@/services/produit';
import { CommandeService, Commande } from '@/services/commande';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

import * as L from 'leaflet';

interface AdresseLivraison {
  latitude?: number;
  longitude?: number;
  adresseTexte: string;
}

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './panier.html',
  styleUrl: './panier.css',
})
export class Panier {

  auth = inject(AuthService);
  router = inject(Router);

  produits: ProduitPanier[] = [];
  total: number = 0;
  id_User?: string;

  // 🚚 LIVRAISON
  modeLivraison: 'retrait' | 'livraison' = 'retrait';
  adresseLivraison: AdresseLivraison = {
    adresseTexte: 'Akoor'
  };
  dateLivraison: Date = new Date();

  // 🗺️ Carte
  map: any;
  marker: any;
  longitude: any;
  latitude: any;

  constructor(
    private cartService: CartService,
    private produitService: ProduitService,
    private commandeService: CommandeService
  ) {}

  ngOnInit() {
    const user = this.auth.user();
    this.id_User = user?.id;

    this.cartService.panier$.subscribe(data => {
      this.produits = data;
      this.total = this.cartService.getTotal();
    });
  }

  // ----------------------------
  // PANIER
  // ----------------------------
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

  // ----------------------------
  // LIVRAISON
  // ----------------------------
  changerModeLivraison() {
    if (this.modeLivraison === 'retrait') {
      this.adresseLivraison = {
      
        adresseTexte: 'Akoor'
      };
    } else {
      setTimeout(() => this.initMap(), 0);
    }
  }

  initMap() {
    if (this.map) return;

    this.map = L.map('map').setView([-18.8792, 47.5079], 13); // Antananarivo

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.map.on('click', async (e: any) => {
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
    
      this.marker = L.marker(e.latlng).addTo(this.map);
    
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
    
      // 🔥 Reverse Geocoding OpenStreetMap
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    
      try {
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json'
          }
        });
    
        const data = await response.json();
    
        const address = data.address || {};
    
        // priorité : quartier → suburb → city → state
        const nomLieu =
          address.suburb ||
          address.neighbourhood ||
          address.city ||
          address.town ||
          address.state ||
          'Adresse inconnue';
    
        this.adresseLivraison = {
          latitude: lat,
          longitude: lng,
          adresseTexte: nomLieu
        };
    
        console.log('Adresse détectée :', this.adresseLivraison);
    
      } catch (error) {
        console.error('Erreur reverse geocoding', error);
    
        this.adresseLivraison = {
          latitude: lat,
          longitude: lng,
          adresseTexte: 'Adresse inconnue'
        };
      }
    });
    
  }

  // ----------------------------
  // COMMANDE
  // ----------------------------
  commander() {
    if (!this.id_User) {
      alert('Vous devez être connecté pour passer une commande');
      return;
    }

    if (this.produits.length === 0) {
      alert('Votre panier est vide');
      return;
    }

    if (this.modeLivraison === 'livraison' && !this.adresseLivraison) {
      alert('Veuillez sélectionner un lieu de livraison');
      return;
    }

    const commande: Commande = {
      acheteur: this.id_User,
      produits: this.produits.map(p => ({
        produit: p.produit,
        quantite: p.quantite
      })),
      total: this.total,
      dateLivraison: this.dateLivraison,
      modeLivraison: this.modeLivraison, // 'retrait' | 'livraison'
      adresseLivraison: this.adresseLivraison
    };

    this.commandeService.passerCommande(commande).subscribe({
      next: () => {
        alert('Commande envoyée ✅');
        this.cartService.viderPanier();
        this.router.navigate(['/commande/suivi']);
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de la commande');
      }
    });
  }
}
