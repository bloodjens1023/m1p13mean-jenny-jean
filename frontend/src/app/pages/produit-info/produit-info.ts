import { Component } from '@angular/core';
import { ProduitDetail } from "@/components/produit-detail/produit-detail";
import { Navbar } from "@/components/navbar/navbar";

@Component({
  selector: 'app-produit-info',
  imports: [ProduitDetail, Navbar],
  templateUrl: './produit-info.html',
  styleUrl: './produit-info.css',
})
export class ProduitInfo {

}
