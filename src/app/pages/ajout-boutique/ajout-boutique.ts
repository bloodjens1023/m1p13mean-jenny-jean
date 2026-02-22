import { BoutiqueService } from '@/services/boutique';

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { NavbarAdmin } from "../../components/navbar-admin/navbar-admin"
import { UserDropdownComponent } from "@/components/user-shop-dropdown/user-shop-dropdown";
import { DropdownCatComponent } from "@/components/dropdown-categorie/dropdown-categorie";
@Component({
  selector: 'app-ajout-boutique',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NavbarAdmin,
    UserDropdownComponent,
    DropdownCatComponent
],
  templateUrl: './ajout-boutique.html',
  styleUrl: './ajout-boutique.css',
})
export class AjoutBoutique {
  owner: string = '';
  categorie: string='';
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
      categorie:[''],
      owner:[''],
      loyerMensuel: [0, [Validators.min(0)]],
      tauxCommission: [0, [Validators.min(0), Validators.max(100)]],
      active: [false]
    });
  }
   onSubmit() {

    this.boutiqueForm.patchValue({
      owner: this.owner,
      categorie: this.categorie
    });
    console.log("FORM VALUE :", this.boutiqueForm.value);
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
    this.owner = user._id;
  }
  OncategorieSelection(categorie: any) {
    this.categorie = categorie._id;
  }
}
