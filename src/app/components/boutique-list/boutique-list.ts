import { BoutiqueService } from '@/services/boutique';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-boutique-list',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './boutique-list.html',
  styleUrl: './boutique-list.css',
})
export class BoutiqueList {

  boutiques: any[] = [];

  private router = inject(Router);

  constructor(private boutiqueService: BoutiqueService) {}

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
  }

  boutique_clique(id: string): void {
    console.log("Boutique cliquée avec l'ID :", id);
    this.router.navigate(['/admin/boutique/update', id]);
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

  confirmToggle(boutique: any): void {
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
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.activeProduit(boutique._id);
      }
    });
  }

  boutique_detail(id: string): void {
    console.log("Boutique détail ID :", id);
    this.router.navigate(['/admin/boutique/detail', id]);
  }
}
