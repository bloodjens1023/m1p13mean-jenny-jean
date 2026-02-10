import { Component, inject, OnInit } from '@angular/core';
import { Admin } from "@/components/admin/admin";
import { Router } from '@angular/router';
import { AuthService } from '@/services/auth';


@Component({
  selector: 'app-admin-login',
  imports: [Admin],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin implements OnInit{
   constructor(private authService: AuthService) {}
    router = inject(Router);
  ngOnInit() {
        this.authService.getCurrentUserRole(); // Vérifie si l'utilisateur est connecté
        if(this.authService.user()?.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        }

    }
}
