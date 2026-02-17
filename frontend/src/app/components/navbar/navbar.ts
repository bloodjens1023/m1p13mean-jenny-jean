import { AuthService } from '@/services/auth';
import { CategorieService } from '@/services/categorie';
import { RechercheService } from '@/services/recherche';
import { CartService } from '@/services/cart';
import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
  ,
  imports: [RouterLink,CommonModule,FormsModule ]
})
export class Navbar{
  mobileMenuOpen = false;
  auth = inject(AuthService);
  showUserMenu = false;
  userMenuOpen = false;
  nombreArticles = 0;
  categorie: any[] = [];
  q: string = '';
  categorie1: string = 'Toutes';
  categories: any[] = [];

  constructor(private cartService: CartService , private categorieService: CategorieService,private searchService: RechercheService) {}

  ngOnInit() {
    this.cartService.panier$.subscribe(panier => {
      this.nombreArticles = panier.reduce((acc, p) => acc + p.quantite, 0);
    });
    this.loadCategorie();
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
  loadCategorie() {
    this.categorieService.getCategorie().subscribe({
      next: (categories) => {
        this.categorie = categories;
      }
    });
  }
  
  onSearch() {
    console.log('Recherche:', {
      q: this.q,
      categorie: this.categorie1
    });
    this.searchService.recherche(
      this.q || '',
      this.categorie1 || 'Toutes')
  }
  

}
