import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

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
      },
      error: (err) => {
        console.error('Erreur login :', err.error?.message || err);
        this.toastr.error(err.error?.message||'Erreur lors de la connexion');
      }
    });
  }
}
