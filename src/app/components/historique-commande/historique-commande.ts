import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '@/services/auth';
import { CommandeService } from '@/services/commande';

@Component({
  selector: 'app-historique-commande',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historique-commande.html',
  styleUrl: './historique-commande.css',
})
export class HistoriqueCommande {

  auth = inject(AuthService);
  commandeService = inject(CommandeService);

  commandes: any[] = [];
  acheteur!: string;

  ngOnInit() {
    const user = this.auth.user();

    if (!user || !user.id) {
      return;
    }

    this.acheteur = user.id;
  this.loadHistorique();
  }

  loadHistorique() {
    this.commandeService.historiqueCommandes(this.acheteur)
      .subscribe(res => {
        this.commandes = res.historique;
      });
  }
}