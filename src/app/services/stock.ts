import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/utils/environment';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private apiUrl = `${environment.apiUrl}/api/stock`;

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
