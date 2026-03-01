
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

  produits: any[] = [];

  constructor(
    private produitService: ProduitService,

    private router: Router
  ) {}

  ngOnInit() {
    this.lister();
  }

  lister() {
    this.produitService.getProduit().subscribe({
      next: (res) => {
        this.produits = res;
      }
    });
  }



  produit_clique(id: string) {
    this.router.navigate(['/user/produit', id]);
  }
  getImageUrl(image: string) {
    return 'https://m1p13mean-jenny-jean-backend-1.onrender.com/uploads/' + image;
  }
}


