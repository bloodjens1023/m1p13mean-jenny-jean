import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { toast } from 'ngx-sonner';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor(private authService: AuthService) {}

  onLogin() {
    console.log('Données envoyées :', this.loginData);

    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        console.log('Réponse backend :', res);
        console.log('Token :', res.token);
        console.log('User :', res.user);

      toast.success('Connexion réussite', {
      description: 'Vous êtes maintenant connecté.'})

      },
      error: (err) => {
        console.error('Erreur login :', err.error?.message || err);
        toast.error('Connexion impossible', {
        description: err.error?.message || 'Une erreur est survenue lors de la connexion.'})
      }
    });
  }
}
