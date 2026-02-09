import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
 providedIn: 'root'
})

export class UserService {

 private apiUrl = 'http://localhost:3000/api/auth';

 constructor(private http: HttpClient) {}
  getUserShop(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/selectShop`)}
 addUser(user: any): Observable<any> {
 return this.http.post(this.apiUrl, user);
 }

 insertUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/insertUser`, user);
}
 updateUser(id: string, user: any): Observable<any> {
 return this.http.put(`${this.apiUrl}/${id}`, user);
 }
 deleteUser(id: string): Observable<any> {
 return this.http.delete(`${this.apiUrl}/${id}`);
 }
}
