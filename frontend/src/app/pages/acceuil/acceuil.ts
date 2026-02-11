import { Component, inject, OnInit } from '@angular/core';
import { Navbar } from "@/components/navbar/navbar";
import { ProduitList } from "@/components/produit-list/produit-list";
import { Footer } from "@/components/footer/footer";
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acceuil',
  imports: [Navbar, ProduitList, Footer],
  standalone:true,
  templateUrl: './acceuil.html',
  styleUrl: './acceuil.css',
})
export class Acceuil implements OnInit {
  constructor(private authService: AuthService) {}
    router = inject(Router);
  ngOnInit() {
        this.authService.getCurrentUserRole(); // Vérifie si l'utilisateur est connecté
        if(this.authService.user()?.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        }

    }
}
