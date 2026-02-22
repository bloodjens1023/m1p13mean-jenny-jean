import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitList } from './produit-list';
import { RouterLink } from '@angular/router';

describe('ProduitList', () => {
  let component: ProduitList;
  let fixture: ComponentFixture<ProduitList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitList,RouterLink]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduitList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
