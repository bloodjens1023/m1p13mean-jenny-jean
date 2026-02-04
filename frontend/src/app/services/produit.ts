import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
 providedIn: 'root'
})

export class ProduitService {
 private apiUrl = 'http://localhost:3000/api/produits';

 constructor(private http: HttpClient) {}

 getProduit(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/liste`)}

  getProduitById(id: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/liste/${id}`);}


 addProduit(produit: any): Observable<any> {
 return this.http.post(`${this.apiUrl}/creer`, produit);
 }
 updateProduit(id: string, produit: any): Observable<any> {
 return this.http.put(`${this.apiUrl}/${id}`, produit);
 }
 deleteProduit(id: string): Observable<any> {
 return this.http.delete(`${this.apiUrl}/${id}`);
 }
}
