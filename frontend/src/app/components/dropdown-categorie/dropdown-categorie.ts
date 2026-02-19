import { CategorieService } from '@/services/categorie';
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnChanges, Output ,Input,SimpleChanges} from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dropdown-categorie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown-categorie.html',
  styleUrl: './dropdown-categorie.css',
})


export class DropdownCatComponent implements OnInit {

  private _selectedCategorieId!: string;

  @Input()
  set selectedCategorieId(value: string) {
    this._selectedCategorieId = value;
    this.syncSelectedCategorie();
  }

  @Output() categorieSelected = new EventEmitter<any>();

  categorie: any[] = [];
  selectedCategorie: any = null; 
  dropdownOpen = false;

  constructor(private categorieService: CategorieService) {}

  ngOnInit() {
    this.loadCategorie();
  }
  private syncSelectedCategorie() {
    if (!this._selectedCategorieId || !this.categorie.length) return;

    this.selectedCategorie =
      this.categorie.find(c => c._id === this._selectedCategorieId) || null;
  }


  loadCategorie() {
    this.categorieService.getCategorie().subscribe({
      next: (categories) => {
        this.categorie = categories;
        this.syncSelectedCategorie();
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