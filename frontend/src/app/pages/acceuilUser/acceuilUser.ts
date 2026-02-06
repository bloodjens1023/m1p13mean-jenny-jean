import { Component } from '@angular/core';
import { Navbar } from "@/components/navbar/navbar";
import { BoutiqueList } from "@/components/boutique-list/boutique-list";
import { Footer } from "@/components/footer/footer";
import { ProduitList } from '@/components/produit-list/produit-list';

@Component({
  selector: 'app-acceuilUser',
  imports: [Navbar,ProduitList,BoutiqueList, Footer],
  standalone:true,
  templateUrl: './acceuilUser.html',
  styleUrl: './acceuilUser.css',
})
export class AcceuilUser {
    
}
