import { Component, OnInit } from '@angular/core';
import { NavbarAdmin } from "@/components/navbar-admin/navbar-admin";
import { UserList } from "@/components/user-list/user-list";

@Component({
  selector: 'app-admin-user',
  imports: [NavbarAdmin, UserList],
  templateUrl: './admin-user.html',
  styleUrl: './admin-user.css',
})
export class AdminUser implements OnInit {
  loading = true;
  ngOnInit(): void {
    setTimeout(() => this.loading = false, 900);
  }

}
