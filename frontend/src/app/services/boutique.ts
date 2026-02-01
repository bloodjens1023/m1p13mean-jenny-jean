import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
 providedIn: 'root'
})

export class BoutiqueService {
 private apiUrl = 'http://localhost:5000/commande';

 constructor(private http: HttpClient) {}
 getBoutique(): Observable<any> {
 return this.http.get(this.apiUrl);
 }
 addBoutique(commande: any): Observable<any> {
 return this.http.post(this.apiUrl, commande);
 }
 updateBoutique(id: string, commande: any): Observable<any> {
 return this.http.put(`${this.apiUrl}/${id}`, commande);
 }
 deleteBoutique(id: string): Observable<any> {
 return this.http.delete(`${this.apiUrl}/${id}`);
 }
}
