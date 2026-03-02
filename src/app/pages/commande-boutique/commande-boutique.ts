




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
  selector: 'app-commande-boutique',
  standalone: true,
  imports: [CommonModule, FormsModule, Commandess, NavShop],
  templateUrl: './commande-boutique.html',
  styleUrl: './commande-boutique.css',
})
export class CommandeBoutique implements OnInit {

  today: Date = new Date();
  loading: boolean = false;
  error: boolean = false;
  errorMessage: string = '';
  private commandeService = inject(CommandeService);
  private boutiqueService = inject(BoutiqueService);
  private authService = inject(AuthService);
  boutiqueId: string = '';


  orders: Order[] = [];





  // ====== COMMANDES ======
  setOrderStatus(o: Order, status: 'En attente' | 'Confirmée' | 'Livrée') {
    if (o.status === status) return;
    Swal.fire({
      title: 'Changer le statut ?',
      text: `Passer de "${o.status}" à "${status}"`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        const backendStatut = this.toBackendStatus(status);
        this.commandeService.modifierStatutCommande(o.id, backendStatut).subscribe({
          next: () => {
            o.status = status;
          },
          error: (err) => {
            console.error(err);
            this.triggerError("Mise à jour du statut échouée");
          }
        });
      }
    });
  }

  get salesHistory(): Order[] { return this.orders.filter(o => o.status === 'Livrée'); }
  get totalRevenue(): number { return this.salesHistory.reduce((sum, o) => sum + o.total, 0); }
  get totalDelivered(): number { return this.salesHistory.length; }
  get pendingCount(): number { return this.orders.filter(o => o.status === 'En attente').length; }



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
        this.loadOrders();

      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.triggerError("Chargement de la boutique échoué");
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
    this.loading = false
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
