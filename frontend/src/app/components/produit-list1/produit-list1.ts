import { ProduitService } from '@/services/produit';
import { Router, ActivatedRoute} from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-produit-list1',
  imports: [],
  templateUrl: './produit-list1.html',
  styleUrl: './produit-list1.css',
})
export class ProduitList1 implements  OnInit  {
  produit : any[] = [];
  router = inject(Router);
  route = inject(ActivatedRoute);
  idBoutique!: string;

  constructor(private produitService: ProduitService) {}

  ngOnInit(){
      this.route.paramMap.subscribe(params => {
        this.idBoutique = params.get('idBoutique')!;
    
        console.log('ID Boutique récupéré depuis URL :', this.idBoutique);
    
        if (this.idBoutique) {
          this.lister();
        }
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


}


