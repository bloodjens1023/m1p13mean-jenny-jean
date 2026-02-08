import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
 providedIn: 'root'
})

export class BoutiqueService {
 private apiUrl = 'http://localhost:3000/api/boutiques';

 constructor(private http: HttpClient) {}
 getBoutique(): Observable<any> {
 return this.http.get(`${this.apiUrl}/liste`);
 }
  getBoutiqueById(id: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/liste/${id}`);}
 addBoutique(boutique: any): Observable<any> {
 return this.http.post(`${this.apiUrl}/create`, boutique);
 }
 updateBoutique(id: string, boutique: any): Observable<any> {
 return this.http.put(`${this.apiUrl}/${id}/update`, boutique);
}
  activeBoutique(id: string,): Observable<any> {
 return this.http.patch(`${this.apiUrl}/${id}/activation`,{});
 }
 deleteBoutique(id: string): Observable<any> {
 return this.http.delete(`${this.apiUrl}/${id}`);
 }
}
