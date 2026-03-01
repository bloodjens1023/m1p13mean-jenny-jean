import { BoutiqueService } from '@/services/boutique';
import { FinanceService } from '@/services/finance';
import { CommonModule } from '@angular/common';

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarAdmin } from "../navbar-admin/navbar-admin";
interface Boutik {
  loyerMensuel: number;
  _id: string;
  boutique: string;
  type: string;
  montant: number;
  description: string;
}

@Component({
  selector: 'app-finance',
  imports: [CommonModule, FormsModule, NavbarAdmin],
  templateUrl: './finance.html',
  styleUrl: './finance.css',
})


export class AdminFinanceComponent implements OnInit {

  moisSelectionne: string = '';
  financeData: any = [];
  boutiques: any[] = [];
  isOpen = false;
  isModalOpen = false;
  form = {
    boutique: '',
    type: '',
    montant: '',
    description: ''
  };


  constructor(private financeService: FinanceService, private boutiqueService : BoutiqueService) {
     const today = new Date();
    const month = today.getMonth() + 1; // Janvier = 0
    const monthStr = month < 10 ? '0' + month : month;
    this.moisSelectionne = `${today.getFullYear()}-${monthStr}`;
  }

  ngOnInit(): void {
    this.boutiqueDetail()
    this.chargerFinance()
  }


openModal() {
  this.isModalOpen = true;
}

closeModal() {
  this.isModalOpen = false;
}
toggleMenu() {
  this.isOpen = !this.isOpen;
}

logout() {
  // Exemple simple
  localStorage.clear();
  window.location.href = '/login';
}

  boutiqueDetail(): void {
    this.boutiqueService.getBoutique().subscribe({
      next: (res: any[]) => {
        this.boutiques = res;
        console.log(this.boutiques)
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des boutiques :', err);
      }
    });
  }


chargerFinance() {
  if (!this.moisSelectionne) return;

  this.financeService.getFinanceParMois(this.moisSelectionne)
    .subscribe(res => {
      this.financeData = res.data;
      console.log(this.financeData);
    });
}


  ajouterDepense() {
    console.log(this.form)
    this.financeService.ajouterDepense(this.form)
      .subscribe(() => {
        alert('Dépense ajoutée avec succès');
        this.chargerFinance(); 
      });
  }
   get benefice(): number {
    if (!this.financeData) return 0;
    return this.financeData.revenuCentre - this.financeData.totalChargesCentre;
  }
  payerLoyer(b : Boutik){

    console.log(b)
    this.form.boutique = b._id
    this.form.montant = b.loyerMensuel.toString()
    this.form.type = "LOYER"
    this.form.description = "Loyer"
    console.log(this.form)

    this.financeService.ajouterDepense(this.form)
      .subscribe(() => {
        alert('Loyer Payé avec succès');
        this.chargerFinance(); // refresh
      });

    this.form ={
      boutique : "",
      montant : "",
      type : "",
      description : ""
    }
  }
}
