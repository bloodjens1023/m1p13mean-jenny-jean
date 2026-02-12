import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private apiUrl = 'http://localhost:3000/api/stock';

  constructor(private http: HttpClient) {}

  getStock(produitId: string): Observable<number> {
    return new Observable<number>((observer) => {
      this.http.get<any>(`${this.apiUrl}/${produitId}`)
        .subscribe({
          next: (res) => {
            observer.next(res.stock);
            observer.complete();
          },
          error: (err) => {
            observer.error(err);
          }
        });
    });
  }

}
