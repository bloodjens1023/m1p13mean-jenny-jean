import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutiqueList } from './boutique-list';

describe('BoutiqueList', () => {
  let component: BoutiqueList;
  let fixture: ComponentFixture<BoutiqueList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoutiqueList]
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
