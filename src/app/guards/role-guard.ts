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
    const requiredRoles = route.data['roles'] as string[] || [];

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const userRole = this.authService.getCurrentUserRole()?.toLowerCase() || '';

    if (requiredRoles.length > 0 && !requiredRoles.map(r => r.toLowerCase()).includes(userRole)) {
      this.redirectByRole(userRole);
      return false;
    }

    return true;
  }

  private redirectByRole(role: string): void {
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'shop':
        this.router.navigate(['/shop/dashboard']);
        break;
      case 'user':
        this.router.navigate(['/']);
        break;
      default:
        this.router.navigate(['/login']);
        break;
    }
  }

}
