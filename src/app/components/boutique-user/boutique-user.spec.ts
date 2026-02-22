import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutiqueUser } from './boutique-user';

//import { RouterLink } from '@angular/router';

//import { RouterLink } from '@angular/router';


describe('BoutiqueUser', () => {
  let component: BoutiqueUser;
  let fixture: ComponentFixture<BoutiqueUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({

    })
    .compileComponents();

    fixture = TestBed.createComponent(BoutiqueUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
