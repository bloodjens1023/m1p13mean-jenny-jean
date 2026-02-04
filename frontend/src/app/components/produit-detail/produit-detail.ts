import { ProduitService } from '@/services/produit';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-produit-detail',
  imports: [RouterModule],
  templateUrl: './produit-detail.html',
  styleUrl: './produit-detail.css',
})
export class ProduitDetail {
  constructor(
    private route: ActivatedRoute,
    private produitService: ProduitService
  ) {}
   produit : any[] = [];
  id!: string;

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.loadProduit();
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
