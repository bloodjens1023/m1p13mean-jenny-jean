import { CategorieService } from '@/services/categorie';
import { CommonModule } from '@angular/common';
import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dropdown-categorie',
  imports: [CommonModule],
  templateUrl: './dropdown-categorie.html',
  styleUrl: './dropdown-categorie.css',
})


export class DropdownCatComponent implements OnInit {

  @Output() categorieSelected = new EventEmitter<any>();

  categorie: any[] = [];
  selectedCategorie: any = null; 
  dropdownOpen = false;

  constructor(private categorieService: CategorieService) {}

  ngOnInit() {
    this.loadCategorie();
  }

  loadCategorie() {
    this.categorieService.getCategorie().subscribe({
      next: (categories) => {
        this.categorie = categories;
      }
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectCat(categorie: any) {
    this.selectedCategorie = categorie;
    console.log('Categorie sélectionnée:', categorie._id);

    this.categorieSelected.emit(categorie); 
  }

  trackByUserId(index: number, categorie: any): any {
    return categorie._id;
  }
}