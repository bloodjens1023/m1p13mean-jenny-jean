import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:3000/api/commandes';

  constructor(private http: HttpClient) {}

  passerCommande(commande: Commande): Observable<any> {
    return this.http.post(`${this.apiUrl}/ajouter`, commande);
  }
  historiqueCommandes(acheteur: string): Observable<any>{
    return this.http.get(`${this.apiUrl}/historique/${acheteur}`);
  }
}
