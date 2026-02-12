import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
 providedIn: 'root'
})

export class CategorieService {
 private apiUrl = 'http://localhost:3000/api/categorie';

 constructor(private http: HttpClient) {}
 getCategorie(): Observable<any> {
 return this.http.get(`${this.apiUrl}/cat`);
 }
}
