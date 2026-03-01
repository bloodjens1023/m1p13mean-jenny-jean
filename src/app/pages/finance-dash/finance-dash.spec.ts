import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceDash } from './finance-dash';

describe('FinanceDash', () => {
  let component: FinanceDash;
  let fixture: ComponentFixture<FinanceDash>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceDash]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceDash);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
});
