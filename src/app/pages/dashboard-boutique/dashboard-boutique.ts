import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoutiqueDashboardService, DashboardStats, ProduitPlusVendu } from '@/services/dashboard-boutique';
import { AuthService } from '@/services/auth';
import { BoutiqueService } from '@/services/boutique';
import { RouterLink } from "@angular/router";
import { NavShop } from "@/components/nav-shop/nav-shop";

@Component({
  selector: 'app-dashboard-boutique',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe, NavShop],
  templateUrl: './dashboard-boutique.html',
  styleUrl: './dashboard-boutique.css',
})

export class DashboardBoutique implements OnInit {

  // ── Infos générales ─────────────────────────────────────
  boutiqueNom = 'Ma Boutique';
  today       = new Date();
  searchTerm  = '';
  loading     = true;
  error       = false;

  // ── KPIs (alimentés par l'API) ──────────────────────────
  caJournalier  = 0;
  caMensuel     = 0;
  nombreVentes  = 0;
  nbCommande    = 0;

  // ── Top produits ─────────────────────────────────────────
  topProduits: { nom: string; ventes: number; pourcentage: number }[] = [];


  //recuperation owner
  auth = inject(AuthService);



  constructor(
    private dashboardService: BoutiqueDashboardService,
    private authService: AuthService,
    private boutiqueService: BoutiqueService
  ) {}

  ngOnInit(): void {
    const owner = this.authService.user()?.id;
    if (!owner) {
      console.error('Owner non trouvé');
      return;
    }

    this.boutiqueService.getBoutiqueByIdOwner(owner).subscribe({

      next: (boutiques) => {
        if (boutiques && boutiques.length > 0) {
          const boutiqueId = boutiques[0]._id;



          this.loadStats(boutiqueId);
        } else {
          console.warn('Aucune boutique trouvée pour cet owner');
        }
      },
      error: (err) => {
        console.error('Erreur récupération boutique', err);
      }
    });
  }


  loadStats(boutiqueId: string): void {
    console.log(boutiqueId)
    this.loading = true;
    this.error   = false;

    this.dashboardService.getStats(boutiqueId).subscribe({
      next: (stats: DashboardStats) => {
        this.caJournalier = stats.chiffreAffairesJournalier;
        this.caMensuel    = stats.chiffreAffairesMensuel;
        this.nombreVentes = stats.nombreVentes;
        this.nbCommande   = stats.nbCommande;
        this.topProduits  = this.mapTopProduits(stats.produitsPlusVendus);
        this.loading      = false;
      },
      error: (err: any) => {
        console.error('Erreur chargement dashboard :', err);
        this.error   = true;
        this.loading = false;
      }
    });
  }

  // Convertit les produits API en format affichable avec pourcentage
  private mapTopProduits(produits: ProduitPlusVendu[]): { nom: string; ventes: number; pourcentage: number }[] {
    if (!produits.length) return [];
    const max = produits[0].totalVendu; // déjà trié par -totalVendu
    return produits.map(p => ({
      nom:         p.nomProduit,
      ventes:      p.totalVendu,
      pourcentage: Math.round((p.totalVendu / max) * 100)
    }));
  }

   commandes = [
    { id: '0041', produit: 'Sneakers Air Pro', quantite: 2, total: 189.99, date: new Date('2025-02-15'), statut: 'Livrée'   },
    { id: '0040', produit: 'Sac à dos Urban',  quantite: 1, total: 74.50,  date: new Date('2025-02-14'), statut: 'En cours' },
    { id: '0039', produit: 'Montre Classic',   quantite: 1, total: 219.00, date: new Date('2025-02-13'), statut: 'Livrée'   },
    { id: '0038', produit: 'Casquette Logo',   quantite: 3, total: 44.85,  date: new Date('2025-02-12'), statut: 'En cours' },
    { id: '0037', produit: 'Veste Softshell',  quantite: 1, total: 134.99, date: new Date('2025-02-10'), statut: 'Annulée'  },
    { id: '0036', produit: 'Sneakers Air Pro', quantite: 1, total: 94.99,  date: new Date('2025-02-09'), statut: 'Livrée'   },
  ];
}

