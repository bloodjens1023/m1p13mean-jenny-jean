import { UserService } from '@/services/user';
import { CommonModule } from '@angular/common';
import { Component, OnInit, Output ,Input} from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-shop-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-shop-dropdown.html',
  styleUrl: './user-shop-dropdown.css',
})


export class UserDropdownComponent implements OnInit {
  private _selectedUserId!: string;

  @Input()
  set selectedUserId(value: string) {
    this._selectedUserId = value;
    this.syncSelectedUser();
  }

  get selectedUserId() {
    return this._selectedUserId;
  }
  @Output() shopSelection = new EventEmitter<any>();
  shopUsers: any[] = [];
  selectedShopUser: any = null;
  dropdownOpen = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadShopUsers();
    
  }

  private syncSelectedUser() {
    if (!this._selectedUserId || !this.shopUsers.length) return;

    this.selectedShopUser =
      this.shopUsers.find(u => u._id === this._selectedUserId) || null;
  }

  loadShopUsers() {
    this.userService.getUserShop().subscribe({
      next: (users) => {
        if (users.length > 0) {
          this.shopUsers = users;
          this.syncSelectedUser();
          console.log('Utilisateurs SHOP chargés :', this.shopUsers);
        }
      }
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectUser(user: any) {
      this.selectedShopUser = user;
      console.log('Utilisateur SHOP sélectionné:', user._id);
      this.shopSelection.emit(user); 
    
  }

  trackByUserId(index: number, user: any): any {
    return user._id;
  }
}
