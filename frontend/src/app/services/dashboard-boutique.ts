import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProduitPlusVendu {
  _id: string;
  nomProduit: string;
  totalVendu: number;
}

export interface DashboardStats {
  chiffreAffairesJournalier: number;
  chiffreAffairesMensuel: number;
  nombreVentes: number;
  produitsPlusVendus: ProduitPlusVendu[];
  nbCommande: number;
}

@Injectable({
  providedIn: 'root'
})
export class BoutiqueDashboardService {

  private apiUrl = "http://localhost:3000/api/" ;

  constructor(private http: HttpClient) {}

  getStats(boutiqueId: string): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/commandes/dashboard/${boutiqueId}`);
  }
}
