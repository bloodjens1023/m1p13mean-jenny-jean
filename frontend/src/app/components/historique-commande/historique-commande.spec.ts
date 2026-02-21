import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueCommande } from './historique-commande';

describe('Panier', () => {
  let component: HistoriqueCommande;
  let fixture: ComponentFixture<HistoriqueCommande>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriqueCommande]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriqueCommande);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
