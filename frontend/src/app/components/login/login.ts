import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { ToastrService } from 'ngx-toastr';

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
  toastr = inject(ToastrService);

  constructor(private authService: AuthService) {}

  onLogin() {
    console.log('Données envoyées :', this.loginData);

    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        console.log('Réponse backend :', res);
        console.log('Token :', res.token);
        console.log('User :', res.user);
        this.toastr.success("connexion réussite !");
      },
      error: (err) => {
        console.error('Erreur login :', err.error?.message || err);
        this.toastr.error(err.error?.message||'Erreur lors de la connexion');
      }
    });
  }
}
