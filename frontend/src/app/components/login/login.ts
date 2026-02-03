import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router'; // <-- importer RouterModule et Router
import { AuthService } from '../../services/auth';
<<<<<<< HEAD
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
=======
import { toast } from 'ngx-sonner';
>>>>>>> upstream/main

@Component({
  selector: 'app-login',
  standalone: true,
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

  constructor(private auth: AuthService,
    private router: Router) {}

  onLogin() {
    console.log('Données envoyées :', this.loginData);

    this.auth.login(this.loginData).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        //localStorage.setItem('token', res.token);
        //localStorage.setItem('user', JSON.stringify(res.user));
        console.log('Réponse backend :', res);
        console.log('Token :', res.token);
<<<<<<< HEAD
        console.log('User :', JSON.stringify(res.user));
        this.toastr.success("connexion réussite !");

        switch (res.user.role) {
          case 'ADMIN':
            this.router.navigate(['/admin/dashboard']);
            break;

          case 'SHOP':
            this.router.navigate(['/shop/dashboard']);
            break;

          case 'USER':
            this.router.navigate(['/user/home']);
            break;

          default:
            this.router.navigate(['/login']);
        }
=======
        console.log('User :', res.user);

        toast.success('Connexion réussite', {
          description: 'Vous êtes maintenant connecté.'
        });

        this.router.navigate(['/acceuil']);
>>>>>>> upstream/main
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
