import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@/services/auth';

@Component({
  selector: 'app-home-redirect',
  standalone: true,
  template: ``,  // composant vide, juste pour rediriger
})
export class HomeRedirect implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/acceuil-user']);
      return;
    }

    const role = this.authService.getCurrentUserRole()?.toLowerCase() || '';

    switch (role) {
      case 'admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'shop':
        this.router.navigate(['/shop/dashboard']);
        break;
      case 'user':
        this.router.navigate(['/acceuil-user']);
        break;
      default:
        this.router.navigate(['/acceuil-user']);
        break;
    }
  }
}
