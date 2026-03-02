import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeBoutique } from './commande-boutique';

describe('CommandeBoutique', () => {
  let component: CommandeBoutique;
  let fixture: ComponentFixture<CommandeBoutique>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandeBoutique]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandeBoutique);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
