import { BoutiqueService } from '@/services/boutique';

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';
import { NavbarAdmin } from "../../components/navbar-admin/navbar-admin"
import { UserDropdownComponent } from "@/components/user-shop-dropdown/user-shop-dropdown";
@Component({
  selector: 'app-ajout-boutique',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule, RouterLink,
    NavbarAdmin,
    UserDropdownComponent
],
  templateUrl: './ajout-boutique.html',
  styleUrl: './ajout-boutique.css',
})
export class AjoutBoutique {
  IdShop: string = '';
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
      shopID:[''],
      loyerMensuel: [0, [Validators.min(0)]],
      tauxCommission: [0, [Validators.min(0), Validators.max(100)]],
      active: [false]
    });
  }





   onSubmit() {
    if (this.boutiqueForm.valid) {



      this.boutiqueService.addBoutique(this.boutiqueForm.value).subscribe({
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
                    description:'Eviter de donner un même code a 2 boutiques differents.'
                  });
        }
      });
    }
  }
  OnshopSelection(user: any) {
    this.IdShop = user._id;
    this.boutiqueForm.patchValue({ owner: this.IdShop });
    console.log('ID de la boutique sélectionnée:', this.IdShop);
  }
}
