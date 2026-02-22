import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RechercheService {
  private apiUrl = 'http://localhost:3000/api/recherche/recherche';

  private boutiquesSubject = new BehaviorSubject<any[]>([]);
  boutiques$ = this.boutiquesSubject.asObservable();

  private produitsSubject = new BehaviorSubject<any[]>([]);
  produits$ = this.produitsSubject.asObservable();

  constructor(private http: HttpClient) {}

  recherche(q?: string, categorie?: string) {
    let params = new HttpParams();

    if (q && q.trim() !== '') {
      params = params.set('q', q);
    }

    if (categorie && categorie !== 'Toutes') {
      params = params.set('categorie', categorie);
    }

    return this.http.get<any>(this.apiUrl, { params })
    .subscribe(res => {
      this.boutiquesSubject.next(res.boutiques || []);
      this.produitsSubject.next(res.produits || []);
    });
  }
}