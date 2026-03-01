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
  selector: 'app-finance-dash',
  standalone: true,
  imports: [CommonModule, FormsModule, Commandess, NavShop],
  templateUrl: './finance-dash.html',
  styleUrls: ['./finance-dash.css'],
})
export class FinanceDash implements OnInit {

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

  products: Product[] = [
    { id: 'P001', name: 'Chemise Classic', category: 'Vêtements', stock: 12, price: 45000, editing: false, promoActive: false, discountPercent: 0 },
    { id: 'P002', name: 'Sneakers Air Pro', category: 'Chaussures', stock: 3, price: 120000, editing: false, promoActive: false, discountPercent: 0 },
    { id: 'P003', name: 'Casquette Logo', category: 'Accessoires', stock: 0, price: 25000, editing: false, promoActive: false, discountPercent: 0 },
  ];

  newProduct: (Partial<Product> & { description?: string; couleur?: string }) = {
    id: '',
    name: '',
    category: '',
    stock: 0,
    price: 0,
    promoActive: false,
    discountPercent: 0,
    description: '',
    couleur: ''
  };

  orders: Order[] = [
    { id: 'CMD-1001', customer: 'Jean', items: [{ name: 'Chemise Classic', qty: 1 }], qty: 1, date: new Date(), total: 45000, status: 'En attente' },
    { id: 'CMD-1002', customer: 'Aina', items: [{ name: 'Sneakers Air Pro', qty: 1 }], qty: 1, date: new Date(), total: 120000, status: 'Confirmée' },
    { id: 'CMD-1003', customer: 'Rivo', items: [{ name: 'Casquette Logo', qty: 2 }], qty: 2, date: new Date(), total: 50000, status: 'Livrée' },
  ];

  showAddForm: boolean = false;
  toggleAddForm() { this.showAddForm = !this.showAddForm; }

  // ====== PRODUITS ======
  addProduct() {
    // Logique harmonisée avec ajout-produit.ts (L210-233)
    if (!this.newProduct?.name || this.newProduct?.price == null || this.newProduct?.stock == null) return;
    const formData = new FormData();
    formData.append('nom', this.newProduct.name!);
    formData.append('prix', this.newProduct.price!.toString());
    formData.append('stock', this.newProduct.stock!.toString());
    if (this.boutiqueId) formData.append('boutiqueId', this.boutiqueId);
    if (this.newProduct.description) formData.append('description', this.newProduct.description);
    if (this.newProduct.couleur) formData.append('couleur', this.newProduct.couleur);
    if (this.newProduct.category) formData.append('categorie', this.newProduct.category);
    if (this.newProduct.discountPercent) formData.append('discountPercent', String(this.newProduct.discountPercent));
    if (this.newProductImage) formData.append('image', this.newProductImage);

    this.loading = true;
    this.produitService.addProduit(formData).subscribe({
      next: () => {
        this.loading = false;
        this.loadProducts();
        this.closeAddModal();
        Swal.fire({
          icon: 'success',
          title: 'Produit ajouté',
          text: 'Le produit a été ajouté avec succès.',
          confirmButtonColor: '#6366f1'
        });
        this.newProduct = {
          id: '',
          name: '',
          category: '',
          stock: 0,
          price: 0,
          promoActive: false,
          discountPercent: 0,
          description: '',
          couleur: ''
        };
        this.newProductImage = null;
        this.imagePreview = null;
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.triggerError('Ajout produit échoué');
      }
    });
  }

  startEdit(p: Product) { p._backup = { ...p }; p.editing = true; }
  cancelEdit(p: Product) { if(p._backup) Object.assign(p, p._backup); p.editing = false; delete p._backup; }
  saveEdit(p: Product) {
    const payload: any = {
      nom: p.name,
      prix: p.price,
      stock: p.stock,
      categorie: p.category
    };
    this.produitService.updateProduit(p.id, payload).subscribe({
      next: () => {
        p.editing = false; delete p._backup;
        this.loadProducts();
      },
      error: (err) => {
        console.error(err);
        this.triggerError('Mise à jour produit échouée');
      }
    });
  }
  deleteProduct(id: string) {
    Swal.fire({
      title: 'Supprimer le produit ?',
      text: 'Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#ef4444'
    }).then(result => {
      if (result.isConfirmed) {
        this.produitService.deleteProduit(id).subscribe({
          next: () => this.loadProducts(),
          error: (err) => {
            console.error(err);
            this.triggerError('Suppression produit échouée');
          }
        });
      }
    });
  }
  updatePrice(p: Product) { if (p.price < 0) p.price = 0; }
  togglePromo(p: Product) { p.promoActive = !p.promoActive; }
  discountedPrice(p: Product): number { return p.promoActive ? Math.max(0, Math.round(p.price * (1 - p.discountPercent / 100))) : p.price; }

  getStatusClass(stock: number) {
    if (stock <= 0) return 'text-rose-600 bg-rose-50';
    if (stock <= 5) return 'text-amber-600 bg-amber-50';
    return 'text-emerald-600 bg-emerald-50';
  }
  getStatusLabel(stock: number) {
    if (stock <= 0) return 'Rupture';
    if (stock <= 5) return 'Stock faible';
    return 'En stock';
  }

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

  // ====== MODAL AJOUT PRODUIT ======
  addModalOpen: boolean = false;
  openAddModal() { this.addModalOpen = true; }
  closeAddModal() {
    this.addModalOpen = false;
  }
  get canSubmitProduct(): boolean {
    // Aligné avec la logique cible: nom, prix et stock doivent être fournis
    return !!(this.newProduct.name && this.newProduct.price != null && this.newProduct.stock != null);
  }
  submitAddProduct() {
    if (!this.canSubmitProduct) return;
    this.addProduct();
    this.closeAddModal();
  }
  onImageSelected(e: any) {
    const file: File | undefined = e?.target?.files?.[0];
    if (!file) return;
    this.newProductImage = file;
    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result as string;
    reader.readAsDataURL(file);
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
        this.products = (res || []).map((p: any) => ({
          id: p._id || p.id || '',
          name: p.nom || p.name || '',
          category: p.categorie || p.category || '',
          stock: p.stock ?? 0,
          price: p.prix ?? 0,
          editing: false,
          promoActive: false,
          discountPercent: 0
        }));
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
