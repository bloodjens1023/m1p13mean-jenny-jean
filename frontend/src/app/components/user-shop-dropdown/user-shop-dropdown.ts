import { UserService } from '@/services/user';
import { CommonModule } from '@angular/common';
import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-shop-dropdown',
  imports: [CommonModule],
  templateUrl: './user-shop-dropdown.html',
  styleUrl: './user-shop-dropdown.css',
})


export class UserDropdownComponent implements OnInit {
  @Output() shopSelection = new EventEmitter<any>();
  shopUsers: any[] = [];
  selectedShopUser: any = null;
  dropdownOpen = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadShopUsers();
  }

  /** Charge uniquement les utilisateurs SHOP */
  loadShopUsers() {
    this.userService.getUserShop().subscribe({
      next: (users) => {
        if (users.length > 0) {
          this.shopUsers = users;
          console.log('Utilisateurs SHOP chargés :', this.shopUsers);
        }
      }
    });
  }

  /** Toggle dropdown */
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  /** Sélection utilisateur */
  selectUser(user: any) {
    this.selectedShopUser = user;
    console.log('Utilisateur SHOP sélectionné:', user._id);
    this.shopSelection.emit(user); // Émettre l'utilisateur sélectionné au parent
    // Émettre événement parent si besoin
  }

  /** TrackBy pour perf */
  trackByUserId(index: number, user: any): any {
    return user._id;
  }
}
