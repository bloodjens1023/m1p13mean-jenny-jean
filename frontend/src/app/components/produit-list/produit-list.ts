import { ProduitService } from '@/services/produit';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-produit-list',
  imports: [],
  templateUrl: './produit-list.html',
  styleUrl: './produit-list.css',
})
export class ProduitList {
  produit : any[] = [];
  router = inject(Router);
   constructor(private produitService: ProduitService) {}

  ngOnInit(){
      this.lister();
  }
  lister(){
      this.produitService.getProduit().subscribe({
         next: (res) => {
            this.produit = res;
            console.log('Produits récupérés :', this.produit);
         },
         error: (err) => {
            console.error('Erreur lors de la récupération des produits :', err);
         }
      });
  }
  produit_clique(id: string){
    console.log("Produit cliqué avec l'ID :", id);
    this.router.navigate(['/produit', id]);
  }


}


