import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IblSpinner } from './ibl-spinner';

describe('IblSpinner', () => {
  let component: IblSpinner;
  let fixture: ComponentFixture<IblSpinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IblSpinner],
    }).compileComponents();

    fixture = TestBed.createComponent(IblSpinner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
