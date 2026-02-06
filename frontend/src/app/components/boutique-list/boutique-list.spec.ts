import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutiqueList } from './boutique-list';
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
import { RouterLink } from '@angular/router';
>>>>>>> Stashed changes
=======
import { RouterLink } from '@angular/router';
>>>>>>> Stashed changes

describe('BoutiqueList', () => {
  let component: BoutiqueList;
  let fixture: ComponentFixture<BoutiqueList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      imports: [BoutiqueList]
=======
      imports: [BoutiqueList,RouterLink]
>>>>>>> Stashed changes
=======
      imports: [BoutiqueList,RouterLink]
>>>>>>> Stashed changes
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoutiqueList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
