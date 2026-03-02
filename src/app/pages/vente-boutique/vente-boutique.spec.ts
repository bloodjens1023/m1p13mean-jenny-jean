import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenteBoutique } from './vente-boutique';

describe('VenteBoutique', () => {
  let component: VenteBoutique;
  let fixture: ComponentFixture<VenteBoutique>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VenteBoutique]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VenteBoutique);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
