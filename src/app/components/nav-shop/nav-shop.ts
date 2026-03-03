import { AuthService } from '@/services/auth';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-shop',
  imports: [RouterLink],
  templateUrl: './nav-shop.html',
  styleUrl: './nav-shop.css',
})
export class NavShop {
   auth = inject(AuthService);
    logout(){
    this.auth.logout();
  }
}
