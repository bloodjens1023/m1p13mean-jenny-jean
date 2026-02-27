import { Component } from '@angular/core';
import { NavbarAdmin } from "../navbar-admin/navbar-admin";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-info',
  imports: [NavbarAdmin,CommonModule, FormsModule],
  templateUrl: './admin-info.html',
  styleUrl: './admin-info.css',
})
export class AdminInfo {
  isOpen: boolean =false;
  isModalOpen: boolean = false;
    toggleMenu() {
      this.isOpen = !this.isOpen;
    }

  logout() {
    // Exemple simple
    localStorage.clear();
    window.location.href = '/login';
  }
  openModal() {
  this.isModalOpen = true;
}

closeModal() {
  this.isModalOpen = false;
}

}
