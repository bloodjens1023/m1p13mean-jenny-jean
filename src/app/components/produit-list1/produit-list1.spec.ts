import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitList1 } from './produit-list1';
import { RouterLink } from '@angular/router';

describe('ProduitList1', () => {
  let component: ProduitList1;
  let fixture: ComponentFixture<ProduitList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitList1,RouterLink]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduitList1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
