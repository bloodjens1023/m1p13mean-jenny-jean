import { AuthService } from '@/services/auth';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const userRole = this.authService.getCurrentUserRole();

    if (!requiredRoles.includes(userRole || '')) {
      // Redirection selon rôle
      switch(userRole) {
        case 'user':
          this.router.navigate(['/user/acceuil']);
          break;
        case 'boutique':
          // this.router.navigate(['/boutique/dashboard']);
          break;
        default:
          this.router.navigate(['/admin/dashboard']);
      }
      return false;
    }

    return true;
  }
}
