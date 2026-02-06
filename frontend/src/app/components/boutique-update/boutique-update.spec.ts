import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutiqueUpdate } from './boutique-update';

describe('BoutiqueUpdate', () => {
  let component: BoutiqueUpdate;
  let fixture: ComponentFixture<BoutiqueUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoutiqueUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoutiqueUpdate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
