import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
 providedIn: 'root'
})

export class UserService {
<<<<<<< Updated upstream
 private apiUrl = 'http://localhost:3000/api/user';

 constructor(private http: HttpClient) {}
  getUser(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/liste`)}
 addUser(user: any): Observable<any> {
 return this.http.post(this.apiUrl, user);
=======
 private apiUrl = 'http://localhost:3000/api/auth';

 constructor(private http: HttpClient) {}
 getUser(): Observable<any> {
    return this.http.get(this.apiUrl);
>>>>>>> Stashed changes
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
