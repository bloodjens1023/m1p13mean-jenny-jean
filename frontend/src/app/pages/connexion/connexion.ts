import { Component } from '@angular/core';
import { Login } from "@/components/login/login";

@Component({
  selector: 'app-connexion',
  imports: [Login],
  standalone:true,
  templateUrl: './connexion.html',
  styleUrl: './connexion.css',
})
export class Connexion {

}
