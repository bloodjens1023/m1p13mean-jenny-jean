import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutiqueDetail } from './boutique-detail';

describe('BoutiqueDetail', () => {
  let component: BoutiqueDetail;
  let fixture: ComponentFixture<BoutiqueDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoutiqueDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoutiqueDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
