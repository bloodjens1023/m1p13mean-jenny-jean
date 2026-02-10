import { UserService } from '@/services/user';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})


export class UserList {

  users: any[] = [];

  private router = inject(Router);

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.UserDetail();
  }

  UserDetail(): void {
    this.userService.getAllUser().subscribe({
      next: (res: any[]) => {
        this.users = res;
        console.log(res)
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des boutiques :', err);
      }
    });
  }

  user_clique(id: string): void {
    console.log("Boutique cliquée avec l'ID :", id);
    this.router.navigate(['/admin/boutique/update', id]);
  }

  activeUser(id: string): void {
    this.userService.activeUser(id).subscribe({
      next: () => {
        this.UserDetail();
        toast.success('Statut changé', {
          description: 'Le statut de la boutique a été modifié !'
        });
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  confirmToggle(user: any): void {
    Swal.fire({
      title: 'Confirmation',
      text: user.active
        ? 'Voulez-vous désactiver cette compte ?'
        : 'Voulez-vous activer cette compte ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#dc2626'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.activeUser(user._id);
      }
    });
  }

  user_detail(id: string): void {
    console.log("user détail ID :", id);
    this.router.navigate(['/admin/user/detail', id]);
  }

    transform(value: string | Date, indice: number): string {
      if (indice === 1) {
        return new Date(value).toISOString().split('T')[indice].replace(/\.\d+Z?$/, '');
      }
    return new Date(value).toISOString().split('T')[indice].replace('.495Z', '');
  }
}
