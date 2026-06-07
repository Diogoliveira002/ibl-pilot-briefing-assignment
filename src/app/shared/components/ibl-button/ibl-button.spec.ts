import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IblButton } from './ibl-button';

describe('IblButton', () => {
  let component: IblButton;
  let fixture: ComponentFixture<IblButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IblButton],
    }).compileComponents();

    fixture = TestBed.createComponent(IblButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
