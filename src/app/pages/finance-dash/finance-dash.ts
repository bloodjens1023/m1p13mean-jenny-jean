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
import { FinanceService } from '@/services/finance';

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



interface PerformanceFinanciere {
  chiffreAffaires: number;
  totalDepense: number;
  totalBenefice: number;
  totalVente: number;
  nombreVentes: number;
}

@Component({
  selector: 'app-finance-dash',
  standalone: true,
  imports: [CommonModule, FormsModule, Commandess, NavShop],
  templateUrl: './finance-dash.html',
  styleUrls: ['./finance-dash.css'],
})
export class FinanceDash implements OnInit {
  constructor(private financeService: FinanceService) {}

  form = {
    boutique: '',
    type: '',
    montant: '',
    description: ''
  };

  today: Date = new Date();
  loading: boolean = false;
  error: boolean = false;
  errorMessage: string = '';

  private produitService = inject(ProduitService);
  private commandeService = inject(CommandeService);
  private boutiqueService = inject(BoutiqueService);
  private authService = inject(AuthService);

  isModalOpen: boolean = false;
  boutiqueId: string = '';
  newProductImage: File | null = null;
  imagePreview: string | null = null;

  products: Product[] = [];

  performanceData: PerformanceFinanciere = {
    chiffreAffaires: 0,
    totalDepense: 0,
    totalBenefice: 0,
    totalVente: 0,
    nombreVentes: 0
  };
    moisSelectionne: string = this.getMoisActuel();
  loadingPerformance: boolean = false;

  private getMoisActuel(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

   changerMois(nouveauMois: string): void {
    this.moisSelectionne = nouveauMois;
    this.loadPerformanceData();
  }

  private loadPerformanceData(): void {
    const user = this.authService.user();

if (!user || !user.id) {
  console.error("Utilisateur non connecté");
  return;
}

this.boutiqueService
  .getFinanceParBoutique(user.id)
  .subscribe({
    next: (response: any) => {
      console.log('Finance data reçue:', response);
      this.financeData = response;
      this.loadingPerformance = false;
    },
    error: (err) => {
      console.error('Erreur chargement performance:', err);
      this.errorMessage = err.error?.message || err.message;
      this.loadingPerformance = false;
    }
  });
  }

  // ============ GESTION MODALES ============
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  ajouterDepense() {
    this.form.boutique = this.boutiqueId;
    console.log(this.form);
    this.financeService.ajouterDepense(this.form)
      .subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Dépense ajoutée',
          timer: 1500,
          showConfirmButton: false
        });
      });
  }

  // ============ GESTION PROMOTIONS ============

  /**
   * Toggle activation/désactivation promotion avec confirmation
   */
  /**
 * Toggle activation/désactivation promotion avec confirmation
 */
onTogglePromo(event: Event, product: Product): void {
  const checkbox = event.target as HTMLInputElement;
  const wantActivate = checkbox.checked;
  const currentState = product.promoActive;

  // Si on veut activer mais pas de pourcentage valide
  if (wantActivate && (!product.discountPercent || product.discountPercent <= 0)) {
    checkbox.checked = false;
    Swal.fire({
      title: 'Pourcentage requis',
      text: 'Veuillez d\'abord saisir un pourcentage de promotion (1-90%)',
      icon: 'warning',
      confirmButtonColor: '#6366f1'
    });
    return;
  }

  const title = wantActivate ? 'Activer la promotion ?' : 'Désactiver la promotion ?';
  const text = wantActivate
    ? `Appliquer ${product.discountPercent}% de réduction sur "${product.name}" ?`
    : `Retirer la promotion sur "${product.name}" ?`;

  Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Confirmer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: wantActivate ? '#22c55e' : '#ef4444',
    cancelButtonColor: '#6b7280'
  }).then((result) => {
    if (result.isConfirmed) {
      product.promoActive = wantActivate;
      this.savePromotionToBackend(product);
    } else {
      checkbox.checked = currentState;
    }
  });
}

/**
 * Changement du pourcentage de réduction
 */
onDiscountChange(event: Event, product: Product): void {
  const input = event.target as HTMLInputElement;
  let value = parseInt(input.value, 10);

  if (isNaN(value) || value < 0) value = 0;
  if (value > 90) value = 90;

  product.discountPercent = value;

  // Si promo active, sauvegarder immédiatement
  if (product.promoActive) {
    this.savePromotionToBackend(product);
  }
}

/**
 * Sauvegarde promotion vers backend - CORRIGÉ pour matcher le backend
 */
private savePromotionToBackend(product: Product): void {
  const payload = {

    activepromo: product.promoActive,
    promotion: product.discountPercent
  };

  console.log('Envoi au backend:', payload); // Debug

  this.produitService.updateProduit(product.id, payload).subscribe({
    next: (response) => {
      console.log('Réponse backend:', response);

      // Optionnel: synchroniser avec la réponse du serveur
      if (response.activepromo !== undefined) {
        product.promoActive = response.activepromo;
      }
      if (response.promotion !== undefined) {
        product.discountPercent = response.promotion;
      }
    },
    error: (err) => {
      console.error('Erreur mise à jour:', err);

      // Rollback
      product.promoActive = !product.promoActive;

      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: err.error?.message || 'Impossible de mettre à jour la promotion',
        confirmButtonColor: '#ef4444'
      });
    }
  });
}
  /**
   * Calcul du prix remisé
   */
  discountedPrice(product: Product): number {
    if (!product.promoActive || !product.discountPercent) {
      return product.price;
    }
    const discount = product.price * (product.discountPercent / 100);
    return Math.max(0, Math.round(product.price - discount));
  }

  // ============ GESTION PRODUITS ============

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

  showAddForm: boolean = false;
  toggleAddForm() { this.showAddForm = !this.showAddForm; }

  addProduct() {
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
    if (this.newProduct.promoActive) formData.append('promoActive', 'true');
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

        this.resetNewProduct();
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.triggerError('Ajout produit échoué');
      }
    });
  }

  private resetNewProduct(): void {
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
  }

  startEdit(p: Product) {
    p._backup = { ...p };
    p.editing = true;
  }

  cancelEdit(p: Product) {
    if (p._backup) Object.assign(p, p._backup);
    p.editing = false;
    delete p._backup;
  }

  saveEdit(p: Product) {
    const payload: any = {
      nom: p.name,
      prix: p.price,
      stock: p.stock,
      categorie: p.category
    };

    this.produitService.updateProduit(p.id, payload).subscribe({
      next: () => {
        p.editing = false;
        delete p._backup;
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

  updatePrice(p: Product) {
    if (p.price < 0) p.price = 0;
  }

  // ============ STATUS & KPI ============

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



  // ============ UTILITAIRES ============

  refreshData() {
    this.loading = true;
    this.error = false;
    setTimeout(() => this.loading = false, 600);
  }

  triggerError(message: string = "Impossible de charger les données.") {
    this.error = true;
    this.errorMessage = message;
  }

  // ============ MODAL AJOUT PRODUIT ============

  addModalOpen: boolean = false;

  openAddModal() {
    this.addModalOpen = true;
  }

  closeAddModal() {
    this.addModalOpen = false;
  }

  get canSubmitProduct(): boolean {
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

  // ============ INIT ============

  ngOnInit(): void {
    this.initBoutiqueContext();
    this.chargerFinance()
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
        this.loadPerformanceData();
        this.loadProducts();

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
          // Mappez correctement depuis votre backend
          promoActive: p.promoActive || p.activepromo || false,
          discountPercent: p.discountPercent || p.promotion || 0
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

  financeData: any = [];
  chargerFinance() {

  this.loading = true;
  this.financeService.getFinanceParMois(this.moisSelectionne)
    .subscribe(res => {
      this.financeData = res.data;
      console.log(this.financeData);
      this.loading = false;
    }, _err => {
      this.loading = false;
    });
}


}
