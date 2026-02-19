import { BoutiqueService } from '@/services/boutique';

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';
import { NavbarAdmin } from "../navbar-admin/navbar-admin";
import { UserDropdownComponent } from "@/components/user-shop-dropdown/user-shop-dropdown";
import { DropdownCatComponent } from "@/components/dropdown-categorie/dropdown-categorie";

@Component({
  selector: 'app-boutique-update',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule, RouterLink,
    NavbarAdmin,
    UserDropdownComponent,
    DropdownCatComponent
],
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
      owner:['',[Validators.required]],
      categorie:['',[Validators.required]],
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
          owner: boutique.owner?._id || boutique.owner,
          categorie: boutique.categorie?._id || boutique.categorie,
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

    if (!this.boutiqueForm.get('owner')?.value ||
        !this.boutiqueForm.get('categorie')?.value) {
  
      toast.error('Erreur', {
        description: 'Veuillez sélectionner un owner et une catégorie'
      });
      return;
    }
  
    if (this.boutiqueForm.invalid) return;
  
    this.boutiqueService.updateBoutique(this.id, this.boutiqueForm.value).subscribe({
      next: () => {
        toast.success('Succès', {
          description: 'Boutique modifiée avec succès'
        });
        this.router.navigate(['/admin/dashboard']);
      },
      error: () => {
        toast.error('Erreur', {
          description: 'Code déjà utilisé par une autre boutique'
        });
      }
    });
  }
  
  onOwnerChange(user: any) {
    if (!user?._id) return;
    this.boutiqueForm.patchValue({ owner: user._id });
  }
  
  onCategorieChange(categorie: any) {
    if (!categorie?._id) return;
    this.boutiqueForm.patchValue({ categorie: categorie._id });
  }
}
