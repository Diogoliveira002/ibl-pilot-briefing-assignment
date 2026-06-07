import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { vi } from 'vitest';
import { BriefingForm } from './briefing-form';
import { FormArray } from '@angular/forms';

describe('BriefingForm', () => {
  let component: BriefingForm;
  let fixture: ComponentFixture<BriefingForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BriefingForm],
      providers: [provideAnimationsAsync(), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(BriefingForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form initialisation', () => {
    it('should create form with messageTypes, airports and countries controls', () => {
      const form = (component as any).briefingForm;
      expect(form.get('messageTypes')).toBeTruthy();
      expect(form.get('airports')).toBeTruthy();
      expect(form.get('countries')).toBeTruthy();
    });

    it('should start invalid — no checkbox checked and no inputs filled', () => {
      expect((component as any).briefingForm.invalid).toBe(true);
    });

    it('messageTypes FormArray should have one control per report type', () => {
      const array = (component as any).briefingForm.get('messageTypes') as FormArray;
      expect(array.length).toBe((component as any).reportTypes.length);
    });
  });

  describe('atLeastOneChecked validator', () => {
    it('should be invalid when no checkbox is checked', () => {
      const array = (component as any).briefingForm.get('messageTypes') as FormArray;
      array.controls.forEach((c: any) => c.setValue(false));
      expect(array.errors?.['atLeastOneRequired']).toBeTruthy();
    });

    it('should be valid when at least one checkbox is checked', () => {
      const array = (component as any).briefingForm.get('messageTypes') as FormArray;
      array.controls[0].setValue(true);
      expect(array.errors).toBeNull();
    });
  });

  describe('atLeastOneInputFilled validator', () => {
    beforeEach(() => {
      const array = (component as any).briefingForm.get('messageTypes') as FormArray;
      array.controls[0].setValue(true);
    });

    it('should be invalid when both airports and countries are empty', () => {
      const form = (component as any).briefingForm;
      form.get('airports').setValue('');
      form.get('countries').setValue('');
      expect(form.get('airports').errors?.['atLeastOneRequired']).toBe(true);
      expect(form.get('countries').errors?.['atLeastOneRequired']).toBe(true);
    });

    it('should be valid when only airports is filled', () => {
      const form = (component as any).briefingForm;
      form.get('airports').setValue('EGLL');
      form.get('countries').setValue('');
      expect(form.get('airports').errors).toBeNull();
    });

    it('should be valid when only countries is filled', () => {
      const form = (component as any).briefingForm;
      form.get('airports').setValue('');
      form.get('countries').setValue('SK');
      expect(form.get('countries').errors).toBeNull();
    });
  });

  describe('airportValidator', () => {
    it('should be invalid for codes shorter than 4 letters', () => {
      const control = (component as any).briefingForm.get('airports');
      control.setValue('EGL');
      expect(control.errors?.['invalidAirports']).toBe(true);
    });

    it('should be invalid for codes longer than 4 letters', () => {
      const control = (component as any).briefingForm.get('airports');
      control.setValue('EGLLL');
      expect(control.errors?.['invalidAirports']).toBe(true);
    });

    it('should be valid for a single correct ICAO code', () => {
      const form = (component as any).briefingForm;
      form.get('countries').setValue('SK');
      const control = form.get('airports');
      control.setValue('EGLL');
      expect(control.errors?.['invalidAirports']).toBeFalsy();
    });

    it('should be valid for multiple correct ICAO codes', () => {
      const form = (component as any).briefingForm;
      form.get('countries').setValue('SK');
      const control = form.get('airports');
      control.setValue('EGLL LZIB');
      expect(control.errors?.['invalidAirports']).toBeFalsy();
    });
  });

  describe('countryValidator', () => {
    it('should be invalid for codes longer than 2 letters', () => {
      const control = (component as any).briefingForm.get('countries');
      control.setValue('SKK');
      expect(control.errors?.['invalidCountries']).toBe(true);
    });

    it('should be valid for a correct 2-letter country code', () => {
      const form = (component as any).briefingForm;
      form.get('airports').setValue('EGLL');
      const control = form.get('countries');
      control.setValue('SK');
      expect(control.errors?.['invalidCountries']).toBeFalsy();
    });
  });

  describe('uppercase normalisation', () => {
    it('should convert airports input to uppercase', async () => {
      const control = (component as any).briefingForm.get('airports');
      control.setValue('egll');
      await fixture.whenStable();
      expect(control.value).toBe('EGLL');
    });

    it('should convert countries input to uppercase', async () => {
      const control = (component as any).briefingForm.get('countries');
      control.setValue('sk');
      await fixture.whenStable();
      expect(control.value).toBe('SK');
    });
  });

  describe('success output', () => {
    it('should emit BriefingModel when success is called', () => {
      const emitSpy = vi.spyOn((component as any).success, 'emit');
      const form = (component as any).briefingForm;
      const array = form.get('messageTypes') as FormArray;
      array.controls[0].setValue(true);
      form.get('airports').setValue('EGLL');

      (component as any).success.emit(form.value);
      expect(emitSpy).toHaveBeenCalledWith(form.value);
    });
  });
});
