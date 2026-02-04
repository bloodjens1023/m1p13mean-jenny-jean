import { BoutiqueService } from '@/services/boutique';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-boutique-list',
  imports: [CommonModule],
  templateUrl: './boutique-list.html',
  styleUrl: './boutique-list.css',
})
export class BoutiqueList {
  boutiques: any[] = [];
  constructor(private boutiqueService: BoutiqueService){}


  ngOnInit(){
    this.boutiqueDetail();
  }
  boutiqueDetail() {

    this.boutiqueService.getBoutique().subscribe({
         next: (res) => {
            this.boutiques = res;
            console.log('Produits récupérés be :', this.boutiques);
         },
         error: (err) => {
            console.error('Erreur lors de la récupération des produits :', err);
         }
      });
  }
}
