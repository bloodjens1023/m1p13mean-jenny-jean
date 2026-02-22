import { Component } from '@angular/core';
import { Navbar } from "@/components/navbar/navbar";
import { ProduitList1 } from "@/components/produit-list1/produit-list1";
import { Footer } from "@/components/footer/footer";

@Component({
  selector: 'app-acceuil1',
  imports: [Navbar, ProduitList1, Footer],
  standalone:true,
  templateUrl: './acceuil1.html',
  styleUrl: './acceuil1.css',
})
export class Acceuil1 {
    
}
