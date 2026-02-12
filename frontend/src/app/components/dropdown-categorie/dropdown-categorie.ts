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
  @Output() CategorieSelection = new EventEmitter<any>();
  categorie: any[] = [];
  selectedCategorie: any = null;
  dropdownOpen = false;

  constructor(private categorieService: CategorieService) {}

  ngOnInit() {
    this.loadCategorie();
  }

  /** Charge uniquement les utilisateurs SHOP */
  loadCategorie() {
    this.categorieService.getCategorie().subscribe({
      next: (categories) => {
        if (categories.length > 0) {
          this.categorie = categories;
          console.log('Categorie chargés :', this.categorie);
        }
      }
    });
  }

  /** Toggle dropdown */
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  /** Sélection utilisateur */
  selectCat(categorie: any) {
    this.selectedCategorie = categorie;
    console.log('Categorie sélectionné:', categorie._id);
    this.CategorieSelection.emit(categorie); 
  }

  /** TrackBy pour perf */
  trackByUserId(index: number, categorie: any): any {
    return categorie._id;
  }
}

