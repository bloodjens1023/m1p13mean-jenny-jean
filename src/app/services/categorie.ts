import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/utils/environment';

@Injectable({
 providedIn: 'root'
})

export class CategorieService {
 private apiUrl = `${environment.apiUrl}/api/categorie`;

 constructor(private http: HttpClient) {}
 getCategorie(): Observable<any> {
 return this.http.get(`${this.apiUrl}/cat`);
 }
 getCategorieById(): Observable<any> {
 return this.http.get(`${this.apiUrl}/selectCat`);
 }
}
