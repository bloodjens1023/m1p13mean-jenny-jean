import { BoutiqueService } from '@/services/boutique';
<<<<<<< Updated upstream
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-boutique-list',
  imports: [CommonModule],
=======
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-boutique-list',
  imports: [],
>>>>>>> Stashed changes
  templateUrl: './boutique-list.html',
  styleUrl: './boutique-list.css',
})
export class BoutiqueList {
<<<<<<< Updated upstream

  boutiques: any[] = [];
  router = inject(Router);
  constructor(private boutiqueService: BoutiqueService,private route: ActivatedRoute,){}


  ngOnInit(){

    this.boutiqueDetail();
  }
  boutiqueDetail() {

    this.boutiqueService.getBoutique().subscribe({
         next: (res) => {
            this.boutiques = res;
            // console.log('Produits récupérés be :', this.boutiques);
         },
         error: (err) => {
            console.error('Erreur lors de la récupération des produits :', err);
         }
      });
  }
    boutique_clique(id: string){
    console.log("Produit cliqué avec l'ID :", id);
    this.router.navigate(['/admin/boutique/update', id]);
  }


  activeProduit(id: string) {
  this.boutiqueService.activeBoutique(id).subscribe({
    next: () => {
      this.boutiqueDetail();
      toast.success('Statut changé', {
        description: 'Le statut de la boutique a été modifié !'
      });
    },
    error: (err) => console.error('Erreur:', err)
  });
}
confirmToggle(boutique: any) {
  Swal.fire({
    title: 'Confirmation',
    text: boutique.active
      ? 'Voulez-vous désactiver cette boutique ?'
      : 'Voulez-vous activer cette boutique ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#16a34a',
    cancelButtonColor: '#dc2626'
  }).then((result) => {
    if (result.isConfirmed) {
      this.activeProduit(boutique._id);
    }
  });
}

boutique_detail(id: string){
    console.log("Produit cliqué avec l'ID :", id);
    this.router.navigate(['/admin/boutique/detail', id]);
  }

}
=======
  boutique : any[] = [];
  router = inject(Router);
   constructor(private boutiqueService: BoutiqueService) {}

  ngOnInit(){
      this.lister();
  }
  lister(){
      this.boutiqueService.getBoutique().subscribe({
         next: (res) => {
            this.boutique = res;
            console.log('Boutiques récupérés :', this.boutique);
         },
         error: (err) => {
            console.error('Erreur lors de la récupération des Boutiques :', err);
         }
      });
  }
  boutique_clique(id: string){
    console.log("boutique cliqué avec l'ID :", id);
    this.router.navigate(['/boutique', id]);
  }
}


>>>>>>> Stashed changes
