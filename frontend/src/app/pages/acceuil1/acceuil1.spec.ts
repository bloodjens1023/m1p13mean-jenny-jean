import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Acceuil1 } from './acceuil1';

describe('Acceuil', () => {
  let component: Acceuil1;
  let fixture: ComponentFixture<Acceuil1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Acceuil1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Acceuil1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
