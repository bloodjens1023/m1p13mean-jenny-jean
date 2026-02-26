import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/utils/environment';

export interface Commande {
  acheteur: string | null;
  produits: { produit: string; quantite: number }[];
  total: number;
  dateLivraison: string | Date;
  modeLivraison: string;
  adresseLivraison?: { adresseTexte: string; latitude?: number; longitude?: number };
}

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = `${environment.apiUrl}/api/commandes`;

  constructor(private http: HttpClient) {}

  passerCommande(commande: Commande): Observable<any> {
    return this.http.post(`${this.apiUrl}/ajouter`, commande);
  }
  historiqueCommandes(acheteur: string): Observable<any>{
    return this.http.get(`${this.apiUrl}/historique/${acheteur}`);

  }
  commandesParBoutique(idBoutique: string): Observable<any>{
    return this.http.get(`${this.apiUrl}/boutique/${idBoutique}`);

  }
  imprimerFacture(commandeId: string) {
    return `http://localhost:3000/api/commande/${commandeId}/facture`;
  }
  modifierStatutCommande(id: string, statut: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/statut/${id}`,
      { statut }  
    );
  }
}
 