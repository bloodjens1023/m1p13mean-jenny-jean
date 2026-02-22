import { Component } from '@angular/core';
import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer/footer";
//import { BoutiqueList } from '@/components/boutique-list/boutique-list';
import { BoutiqueUser } from '@/components/boutique-user/boutique-user';

@Component({
  selector: 'app-acceuilUser',
  imports: [Navbar,BoutiqueUser, Footer],
  standalone:true,
  templateUrl: './acceuilUser.html',
  styleUrl: './acceuilUser.css',
})
export class AcceuilUser {   
}