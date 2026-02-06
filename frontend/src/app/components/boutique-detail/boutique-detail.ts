import { BoutiqueService } from '@/services/boutique';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-boutique-detail',
  imports: [RouterLink],
  templateUrl: './boutique-detail.html',
  styleUrl: './boutique-detail.css',
})
export class BoutiqueDetail {
  boutique : any[] = [];
  id!: string;
   constructor(
    private route: ActivatedRoute,
    private boutiqueService: BoutiqueService,
    private fb: FormBuilder,
    private router: Router
  ) {}
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.loadBoutique();
  }
  loadBoutique() {
    this.boutiqueService.getBoutiqueById(this.id).subscribe({
      next: (boutique) =>{
        this.boutique = [boutique];
        console.log('Boutique récupérée :', this.boutique);
      } ,
      error: (err) => console.error('Erreur:', err)
    })
  }
  boutique_update(id: string){
    console.log("Produit cliqué avec l'ID :", id);
    this.router.navigate(['/admin/boutique/update', id]);
  }
}
