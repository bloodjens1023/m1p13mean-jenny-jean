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
  image?: File;
  couleur : string;
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
  loadingProduits = true;

  // Modal états
  modalOuvert = false;
  modalSuppressionOuvert = false;
  modeEdition = false;
  produitASupprimer: Produit | null = null;
 selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  boutiqueId: string = ""
  // Formulaire
  produitForm: Partial<Produit> = {};



  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    this.selectedFile = file;

    // Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
  // Couleurs auto pour les avatars
  private couleurs = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

  // Données (à remplacer par appels API)
  loadProduits(id : string) {
    this.loadingProduits = true;
    this.produitService.getProduitByIDBoutique(id).subscribe({
      next: (data) => {
        this.produits = data;
        this.loadingProduits = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des produits', err);
        this.loadingProduits = false;
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

        this.boutiqueId = boutiques[0]._id;
        console.log('Boutique ID:', this.boutiqueId);

        this.loadProduits(this.boutiqueId);

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


      if (!this.produitForm._id) {
    console.error('ID manquant');
    return;
  }

  // Créer FormData au lieu d'envoyer l'objet brut
  const formData = new FormData();

  // Ajouter les champs texte
  formData.append('nom', this.produitForm.nom || '');
  formData.append('prix', String(this.produitForm.prix || 0));
  formData.append('stock', String(this.produitForm.stock || 0));
  formData.append('description', this.produitForm.description || '');
  // ... autres champs

  // Ajouter l'image SI sélectionnée
  if (this.selectedFile) {
    formData.append('image', this.selectedFile, this.selectedFile.name);
  }

  // Envoyer FormData au lieu de produitForm
  this.produitService.updateProduit(
    this.produitForm._id.toString(),
    formData
  ).subscribe({
    next: (updatedProduit) => {
      const index = this.produits.findIndex(p => p._id === updatedProduit._id);
      if (index !== -1) this.produits[index] = updatedProduit;

      this.produitForm = {} as Produit;
      this.selectedFile = null;
    },
    error: (err) => {
      console.error('Erreur mise à jour produit', err);
    }
  });
    } else {
      // Ajout
      const formData = new FormData();
      formData.append('nom', this.produitForm.nom!);
      formData.append('prix', this.produitForm.prix!.toString());
      formData.append('stock', this.produitForm.stock!.toString());
      formData.append('boutiqueId', this.boutiqueId);
      if (this.produitForm.description) formData.append('description', this.produitForm.description);
      if (this.produitForm.couleur) formData.append('couleur', this.produitForm.couleur);

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.produitService.addProduit(formData).subscribe({
        next: () => {
          this.fermerModal();
        },
        error: err => console.error(err)
      });
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
