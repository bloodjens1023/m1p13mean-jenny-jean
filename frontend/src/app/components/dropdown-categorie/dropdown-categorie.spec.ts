import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownCatComponent } from './dropdown-categorie';

describe('DropdownCat', () => {
  let component: DropdownCatComponent;
  let fixture: ComponentFixture<DropdownCatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownCatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownCatComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
