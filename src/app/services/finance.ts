import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/utils/environment';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {

  private apiUrl = `${environment.apiUrl}/api/finance`;

  constructor(private http: HttpClient) {}

  getFinanceParMois(mois: string) {
  return this.http.get<{ message: string, data: any }>(
    `${this.apiUrl}/mensuel?mois=${mois}`
  );
}

  ajouterDepense(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ajout`, data);
  }
}
