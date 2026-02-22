import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router'; // <-- importer RouterModule et Router
import { AuthService } from '../../services/auth';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule], // <-- ajouter RouterModule
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
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
        console.log('Réponse backend :', res);
        console.log('Token :', res.token);
        console.log('User :', res.user.role);
        if(res.user.role === "ADMIN" || res.user.role === "SHOP"){
          toast.error('Erreur de Connexion', {
            description: 'Connexion impossible.'
          });
        localStorage.removeItem('token');
        }else{
           toast.success('Connexion réussite', {
              description: 'Vous êtes maintenant connecté.'
            });
            this.router.navigate(['/user/acceuil-user']);
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
