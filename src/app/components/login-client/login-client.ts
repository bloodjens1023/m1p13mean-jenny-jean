import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router'; // <-- importer RouterModule et Router
import { UserService } from '../../services/user';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-login-client',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login-client.html',
  styleUrls: ['./login-client.css'],
})
export class User {
  showModal = false;
  message = "";
  passconfirm = "";
  loading = false;
  newUser = {
    name: '',
    email: '',
    password: '',

    role: 'USER'
  };
  // injecter le router
  router = inject(Router);

  constructor(private userService: UserService) {}

  onInsertUser() {
    if (this.newUser.password !== this.passconfirm) {
      toast.error('Erreur de confirmation', {
        description: 'Les mots de passe ne correspondent pas.'
      });
      return;
    }else{
      this.loading = true;
       this.userService.insertUser(this.newUser).subscribe({
      next: () => {
        this.loading = false;
        toast.success('Utilisateur créé avec succès');

        this.showModal = false;
        this.newUser = {
          name: '',
          email: '',
          password: '',
          role: 'USER'
        };
      },
      error: (err) => {
        this.loading = false;
        toast.error('Erreur création utilisateur', {
          description: err.error?.message||"veuillez vérifier les champs saisis"
        });
      }
    });
    }

  }
}

