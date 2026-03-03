import { Component, inject, OnInit } from '@angular/core';
import { NavbarAdmin } from "@/components/navbar-admin/navbar-admin";
import { UserList } from "@/components/user-list/user-list";
import { AuthService } from '@/services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-user',
  imports: [NavbarAdmin, UserList, CommonModule],
  templateUrl: './admin-user.html',
  styleUrl: './admin-user.css',
})
export class AdminUser  {
  boutiques: any[] = [];
  boutique_actif: number = 0;
  boutique_total: number = 0;
  user_total: number = 0;
  user: any[] = [];
  auth = inject(AuthService);
  isOpen: boolean = false;
  loading = true;
  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  logout(){
    this.auth.logout();
  }

}
