import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserShopDropdown } from './user-shop-dropdown';

describe('UserShopDropdown', () => {
  let component: UserShopDropdown;
  let fixture: ComponentFixture<UserShopDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserShopDropdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserShopDropdown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
