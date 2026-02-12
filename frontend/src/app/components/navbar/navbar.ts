import { AuthService } from '@/services/auth';
import { CartService } from '@/services/cart';
import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
  ,
  imports: [RouterLink,CommonModule]
})
export class Navbar{
  mobileMenuOpen = false;
  auth = inject(AuthService);
  showUserMenu = false;
  userMenuOpen = false;
  nombreArticles = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.panier$.subscribe(panier => {
      this.nombreArticles = panier.reduce((acc, p) => acc + p.quantite, 0);
    });
  }
  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }


  toggleUserMenus() {
    this.userMenuOpen = !this.userMenuOpen;
  }


  toggleMobileMenu() {

    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  logout(){
    this.cartService.viderPanier();
    this.auth.logout();
  }


}
