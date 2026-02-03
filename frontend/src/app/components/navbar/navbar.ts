import { AuthService } from '@/services/auth';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
  ,
  imports: [RouterLink,CommonModule]
})
export class Navbar{
  mobileMenuOpen = false;
  auth = inject(AuthService);
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  logout(){
    this.auth.logout();
  }
}
