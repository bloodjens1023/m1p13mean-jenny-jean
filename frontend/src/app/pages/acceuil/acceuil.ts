import { Component } from '@angular/core';
import { Navbar } from "@/components/navbar/navbar";
import { ProduitList } from "@/components/produit-list/produit-list";
import { Footer } from "@/components/footer/footer";

@Component({
  selector: 'app-acceuil',
  imports: [Navbar, ProduitList, Footer],
  standalone:true,
  templateUrl: './acceuil.html',
  styleUrl: './acceuil.css',
})
export class Acceuil {
    
}
