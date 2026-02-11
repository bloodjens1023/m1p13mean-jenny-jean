import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
interface User {
  id: string;
  name: string;
  role: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth';
  router = inject(Router);


  user = signal<User | null>(null);

  constructor(private http: HttpClient) {
    this.loadUserFromToken();
  }

  login(loginData: { email: string; password: string }): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.loadUserFromToken();
        })
      );
  }

  private loadUserFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));

    this.user.set({
      id: payload.id,

      name: payload.name,
      role: payload.role
    });
  }

  isAuthenticated(): boolean {
    const token = this.user() ? localStorage.getItem('token') : null;
    return !!token;

  }
  getCurrentUserRole(): 'admin' | 'user' | 'boutique' | null {
    const user = this.user()?.role.toLowerCase() as 'admin' | 'user' | 'boutique' | null;
    return user || null;
  }



  logout() {
    localStorage.removeItem('token');
    this.user.set(null);
    this.router.navigate(['/']);
  }
}
