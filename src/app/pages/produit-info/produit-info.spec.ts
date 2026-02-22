import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitInfo } from './produit-info';

describe('ProduitInfo', () => {
  let component: ProduitInfo;
  let fixture: ComponentFixture<ProduitInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduitInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
