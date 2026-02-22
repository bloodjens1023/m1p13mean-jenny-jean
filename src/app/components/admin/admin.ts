import { AuthService } from '@/services/auth';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  showModal = false;
  message = "";
  loginData = {
    email: '',
    password: ''
  };

  // injecter le router
  router = inject(Router);

  constructor(private authService: AuthService) {}

  onLogin() {
    console.log('Données envoyées :', this.loginData);

    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        if (res.user.role !== 'ADMIN') {
          toast.error('Accès refusé', {
            description: 'Vous n\'avez pas les droits administrateur.'
          });
          return;
        }else{
          // console.log('Réponse backend :', res);
          console.log('Token :', res.token);
          toast.success('Connexion réussite', {
          description: 'Vous êtes maintenant connecté.'
          });


          this.router.navigate(['/admin/dashboard']);

        }




      },
      error: (err) => {
        console.error('Erreur login :', err.error?.message || err);
        toast.error('Connexion impossible', {
          description: err.error?.message || 'Une erreur est survenue lors de la connexion.'
        });
      }
    });
  }
}
