import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutBoutique } from './ajout-boutique';

describe('AjoutBoutique', () => {
  let component: AjoutBoutique;
  let fixture: ComponentFixture<AjoutBoutique>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutBoutique]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutBoutique);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
