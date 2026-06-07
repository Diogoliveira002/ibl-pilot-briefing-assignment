import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IblInput } from './ibl-input';

describe('IblInput', () => {
  let component: IblInput;
  let fixture: ComponentFixture<IblInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IblInput],
    }).compileComponents();

    fixture = TestBed.createComponent(IblInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
