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
  loading = false;

  // injecter le router
  router = inject(Router);

  constructor(private authService: AuthService) {}

  onLogin() {
    this.loading = true;

    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        if (res.user.role !== 'ADMIN') {
          this.loading = false;
          toast.error('Accès refusé', {
            description: 'Vous n\'avez pas les droits administrateur.'
          });
          return;
        }else{
          // console.log('Réponse backend :', res);
          toast.success('Connexion réussite', {
          description: 'Vous êtes maintenant connecté.'
          });
          this.loading = false;


          this.router.navigate(['/admin/dashboard']);

        }



        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur login :', err.error?.message || err);
        this.loading = false
        toast.error('Connexion impossible', {
          description: err.error?.message || 'Une erreur est survenue lors de la connexion.'
        });
      }
    })
  }
}
