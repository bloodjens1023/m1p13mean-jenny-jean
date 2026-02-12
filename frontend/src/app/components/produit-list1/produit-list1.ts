import { ProduitService } from '@/services/produit';
import { Router, ActivatedRoute} from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { BoutiqueService } from '@/services/boutique';
import { CommonModule } from '@angular/common';
import { CartService } from '@/services/cart';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-produit-list1',
  imports: [CommonModule],
  templateUrl: './produit-list1.html',
  styleUrl: './produit-list1.css',
})
export class ProduitList1 implements  OnInit  {
  produit : any[] = [];
  boutique? : any[];
  nomBoutique : string = "";
  router = inject(Router);
  route = inject(ActivatedRoute);
  idBoutique!: string;
  isLoading = true;


  constructor(private produitService: ProduitService,
    private boutiqueService: BoutiqueService,
        private cartService: CartService,) {}

  ngOnInit(){
      this.route.paramMap.subscribe(params => {
        this.idBoutique = params.get('idBoutique')!;

        console.log('ID Boutique récupéré depuis URL :', this.idBoutique);

        if (this.idBoutique) {
          this.lister();
        }
      });
      this.boutique_proprietaire()
      this.isLoading = false;
  }
   ajouterAuPanier(prod: any) {
    this.cartService.ajouterProduit({
      produit: prod._id,
      nom: prod.nom,
      prix: prod.prix,
      quantite: 1,
      stock:prod.stock,
      image: prod.image
    });
     toast.success('Produit Ajouter', {
              description: 'Cette produit a été ajouté avec success.'
            });
  }
  lister() {
    const idBoutique = this.idBoutique;

    if (!idBoutique) {
      console.error('ID Boutique manquant');
      return;
    }

    this.produitService.getProduitByIDBoutique(idBoutique).subscribe({
      next: (res) => {
        this.produit = res;
        console.log('Produits récupérés pour la boutique :', this.produit);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des produits :', err);
      }
    });
  }
  produit_clique(id: string){
    console.log("Produit cliqué avec l'ID :", id);
    this.router.navigate(['/user/produit', id]);
  }

  boutique_proprietaire(){
    this.boutiqueService.getBoutiqueById(this.idBoutique).subscribe({
       next: (res) => {
        this.boutique = [res];
        console.log('boutique :', this.boutique);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de la boutique :', err);
      }
    })
  }




}


