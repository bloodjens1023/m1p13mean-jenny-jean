import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavShop } from './nav-shop';

describe('NavShop', () => {
  let component: NavShop;
  let fixture: ComponentFixture<NavShop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavShop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavShop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
