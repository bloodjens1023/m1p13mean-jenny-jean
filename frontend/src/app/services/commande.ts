import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
 providedIn: 'root'
})

export class CommandeService {
 private apiUrl = 'http://localhost:5000/commande';

 constructor(private http: HttpClient) {}
 getCommande(): Observable<any> {
 return this.http.get(this.apiUrl);
 }
 addCommande(commande: any): Observable<any> {
 return this.http.post(this.apiUrl, commande);
 }
 updateCommande(id: string, commande: any): Observable<any> {
 return this.http.put(`${this.apiUrl}/${id}`, commande);
 }
 deleteCommande(id: string): Observable<any> {
 return this.http.delete(`${this.apiUrl}/${id}`);
 }
}
