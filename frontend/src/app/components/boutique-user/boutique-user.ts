import { BoutiqueService } from '@/services/boutique';
import { CategorieService } from '@/services/categorie';
import { ProduitService } from '@/services/produit';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-boutique-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boutique-user.html',
  styleUrl: './boutique-user.css',
})
export class BoutiqueUser {

  boutiques: any[] = [];
  categorie: any[] = [];

  private router = inject(Router);

  constructor(private boutiqueService: BoutiqueService, private produitService: ProduitService,
     private categorieService : CategorieService) {}

  ngOnInit(): void {
    this.boutiqueDetail();
  }

  boutiqueDetail(): void {
    this.boutiqueService.getBoutique().subscribe({
      next: (res: any[]) => {
        this.boutiques = res;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des boutiques :', err);
      }
    });
    this.categorieService.getCategorie().subscribe({
      next: (res: any[])=>{
        this.categorie = res;
      },
        error: (err) => {
        console.error('Erreur lors de la récupération des boutiques :', err);
      }
    })
  }
  boutique_clique(id: string): void {
    console.log("Boutique cliquée avec l'ID :", id);
    this.router.navigate(['/user/acceuil1', id]);
  }

  activeProduit(id: string): void {
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

  boutique_detail(id: string): void {
    console.log("Boutique détail ID :", id);
    this.router.navigate(['/admin/boutique/detail', id]);
  }
}
