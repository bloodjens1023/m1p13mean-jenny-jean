import { Component } from '@angular/core';
import { Navbar } from "@/components/navbar/navbar";

@Component({
  selector: 'app-acceuil',
  imports: [Navbar],
  standalone:true,
  templateUrl: './acceuil.html',
  styleUrl: './acceuil.css',
})
export class Acceuil {

}
