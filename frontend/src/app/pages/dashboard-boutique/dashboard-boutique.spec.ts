import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBoutique } from './dashboard-boutique';

describe('DashboardBoutique', () => {
  let component: DashboardBoutique;
  let fixture: ComponentFixture<DashboardBoutique>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardBoutique]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardBoutique);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
