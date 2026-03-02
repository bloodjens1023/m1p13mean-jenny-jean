

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Commandess } from "@/components/commande/commande";
import { NavShop } from '@/components/nav-shop/nav-shop';
import { ProduitService } from '@/services/produit';
import { CommandeService } from '@/services/commande';
import { BoutiqueService } from '@/services/boutique';
import { AuthService } from '@/services/auth';
import Swal from 'sweetalert2';

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  editing: boolean;
  promoActive: boolean;
  discountPercent: number;
  _backup?: Partial<Product>;
}

interface OrderItem {
  name: string;
  qty: number;
}

interface Order {
  id: string;
  customer: string;
  items: OrderItem[];
  qty: number;
  date: Date;
  total: number;
  status: 'En attente' | 'Confirmée' | 'Livrée';
}

@Component({
  selector: 'app-vente-boutique',
  standalone: true,
  imports: [CommonModule, FormsModule, NavShop],
  templateUrl: './vente-boutique.html',
  styleUrl: './vente-boutique.css',
})
export class VenteBoutique implements OnInit {

  today: Date = new Date();
  loading: boolean = false;
  error: boolean = false;
  errorMessage: string = '';
  private produitService = inject(ProduitService);
  private commandeService = inject(CommandeService);
  private boutiqueService = inject(BoutiqueService);
  private authService = inject(AuthService);
  boutiqueId: string = '';
  newProductImage: File | null = null;
  imagePreview: string | null = null;



  orders: Order[] = [
  ];



  updatePrice(p: Product) { if (p.price < 0) p.price = 0; }
  togglePromo(p: Product) { p.promoActive = !p.promoActive; }
  discountedPrice(p: Product): number { return p.promoActive ? Math.max(0, Math.round(p.price * (1 - p.discountPercent / 100))) : p.price; }




  get salesHistory(): Order[] { return this.orders.filter(o => o.status === 'Livrée'); }
  get totalRevenue(): number { return this.salesHistory.reduce((sum, o) => sum + o.total, 0); }
  get totalDelivered(): number { return this.salesHistory.length; }
  get pendingCount(): number { return this.orders.filter(o => o.status === 'En attente').length; }

  get bestSellingProduct(): string {
    const counts: Record<string, number> = {};
    this.salesHistory.forEach(o => o.items.forEach(it => counts[it.name] = (counts[it.name] || 0) + it.qty));
    const sorted = Object.entries(counts).sort((a,b) => b[1]-a[1]);
    return sorted.length ? `${sorted[0][0]} (${sorted[0][1]})` : '-';
  }

  // ====== SIMULATION CHARGEMENT / ERREUR ======
  refreshData() {
    this.loading = true;
    this.error = false;
    setTimeout(() => this.loading = false, 600);
  }
  triggerError(message: string = "Impossible de charger les données.") {
    this.error = true; this.errorMessage = message;
  }


  // ====== INIT & LOADERS ======
  ngOnInit(): void {
    this.initBoutiqueContext();
  }

  private initBoutiqueContext() {
    const owner = this.authService.user()?.id;
    if (!owner) {
      this.triggerError("Utilisateur non authentifié");
      return;
    }
    this.loading = true;
    this.boutiqueService.getBoutiqueByIdOwner(owner).subscribe({
      next: (res: any) => {
        const boutiques = Array.isArray(res) ? res : res?.boutiques;
        this.boutiqueId = boutiques && boutiques.length ? boutiques[0]._id : '';
        if (!this.boutiqueId) {
          this.loading = false;
          this.triggerError("Boutique introuvable");
          return;
        }
        this.loadProducts();
        this.loadOrders();
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.triggerError("Chargement de la boutique échoué");
      }
    });
  }

  private loadProducts() {
    if (!this.boutiqueId) return;
    this.produitService.getProduitByIDBoutique(this.boutiqueId).subscribe({
      next: (res: any[]) => {
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.triggerError("Chargement des produits échoué");
      }
    });
  }

  private loadOrders() {
    if (!this.boutiqueId) return;
    this.commandeService.commandesParBoutique(this.boutiqueId).subscribe({
      next: (res: any[]) => {
        this.orders = (res || []).map((c: any) => {
          const items = (c.produits || []).map((it: any) => ({
            name: it.produit?.nom || it.nom || it.produit || 'Produit',
            qty: it.quantite ?? it.qty ?? 1
          }));
          const status = this.fromBackendStatus(c.statut || c.status);
          const qtySum = items.reduce((s: number, it: any) => s + (it.qty || 0), 0);
          return {
            id: c._id || c.id,
            customer: c.acheteur?.name || c.client?.name || c.client || 'Client',
            items,
            qty: c.qty ?? qtySum,
            date: new Date(c.createdAt || c.date || new Date()),
            total: c.total ?? 0,
            status
          } as Order;
        });
      },
      error: (err) => {
        console.error(err);
        this.triggerError("Chargement des commandes échoué");
      }
    });
  }

  private toBackendStatus(s: 'En attente' | 'Confirmée' | 'Livrée'): string {
    if (s === 'Confirmée') return 'Confirmée';
    if (s === 'Livrée') return 'Livrée';
    return 'En attente';
  }
  private fromBackendStatus(s: string): 'En attente' | 'Confirmée' | 'Livrée' {
    const v = (s || '').toLowerCase();
    if (v.includes('confirm')) return 'Confirmée';
    if (v.includes('livr')) return 'Livrée';
    return 'En attente';
  }
}
