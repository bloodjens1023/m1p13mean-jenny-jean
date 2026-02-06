import { BoutiqueService } from '@/services/boutique';

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-boutique-update',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule, RouterLink],
  templateUrl: './boutique-update.html',
  styleUrl: './boutique-update.css',
})
export class BoutiqueUpdate implements OnInit {
  boutiqueForm!: FormGroup;

  boutique : any[] = [];
  id!: string;
  constructor(
    private route: ActivatedRoute,
    private boutiqueService: BoutiqueService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.boutiqueForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      code: ['', [Validators.minLength(3)]],
      description: [''],
      loyerMensuel: [0, [Validators.min(0)]],
      tauxCommission: [0, [Validators.min(0), Validators.max(100)]],
      active: [false]
    });
  }



  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.loadBoutique();
  }

  loadBoutique() {
    this.boutiqueService.getBoutiqueById(this.id).subscribe({
      next: (boutique) =>{
        this.boutique = [boutique];
        this.boutiqueForm.patchValue({
          nom: boutique.nom,
          code: boutique.code,
          description: boutique.description,
          loyerMensuel: boutique.loyerMensuel,
          tauxCommission: boutique.tauxCommission,
          active: boutique.active
        });
      } ,
      error: (err) => console.error('Erreur:', err)
    })
  }




   onSubmit() {
    if (this.boutiqueForm.valid) {



      this.boutiqueService.updateBoutique(this.id, this.boutiqueForm.value).subscribe({
        next: () => {
          toast.success('Connexion réussite', {
                    description: 'Boutique modifiée avec succès !'
                  });
          this.router.navigate(['/admin/dashboard'], {
            state: { message: 'success' }
          });
        },
        error: (err) => {
           toast.error('Erreur', {
                    description: err.error?.message || 'Une erreur est survenue lors de la modification de la boutique.'
                  });
        }
      });
    }
  }
}
