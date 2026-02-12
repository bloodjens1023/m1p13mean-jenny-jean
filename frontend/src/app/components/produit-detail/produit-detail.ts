import { CartService } from '@/services/cart';
import { ProduitService } from '@/services/produit';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-produit-detail',
  imports: [RouterModule,CommonModule],
  templateUrl: './produit-detail.html',
  styleUrl: './produit-detail.css',
})
export class ProduitDetail {
  constructor(
    private route: ActivatedRoute,
    private produitService: ProduitService,
    private cartService: CartService
  ) {}
   produit : any[] = [];
  id!: string;

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.loadProduit();
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
  loadProduit() {
    this.produitService.getProduitById(this.id).subscribe({
      next: (produit) =>{
        this.produit = [produit];
      } ,
      error: (err) => console.error('Erreur:', err)
    });
  }
}
