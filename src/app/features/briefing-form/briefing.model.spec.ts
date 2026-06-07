import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  airportValidator,
  atLeastOneChecked,
  atLeastOneInputFilled,
  countryValidator,
} from './briefing.model';

describe('briefing.model validators', () => {

  describe('airportValidator', () => {
    it('should return null for empty value', () => {
      expect(airportValidator(new FormControl(''))).toBeNull();
    });

    it('should return null for a valid 4-letter ICAO code', () => {
      expect(airportValidator(new FormControl('EGLL'))).toBeNull();
    });

    it('should return null for multiple valid codes', () => {
      expect(airportValidator(new FormControl('EGLL LZIB'))).toBeNull();
    });

    it('should return error for a 3-letter code', () => {
      expect(airportValidator(new FormControl('EGL'))).toEqual({ invalidAirports: true });
    });

    it('should return error for a 5-letter code', () => {
      expect(airportValidator(new FormControl('EGLLL'))).toEqual({ invalidAirports: true });
    });

    it('should return error when any code in a list is invalid', () => {
      expect(airportValidator(new FormControl('EGLL BAD'))).toEqual({ invalidAirports: true });
    });
  });

  describe('countryValidator', () => {
    it('should return null for empty value', () => {
      expect(countryValidator(new FormControl(''))).toBeNull();
    });

    it('should return null for a valid 2-letter country code', () => {
      expect(countryValidator(new FormControl('SK'))).toBeNull();
    });

    it('should return null for multiple valid codes', () => {
      expect(countryValidator(new FormControl('SK GB'))).toBeNull();
    });

    it('should return error for a 1-letter code', () => {
      expect(countryValidator(new FormControl('S'))).toEqual({ invalidCountries: true });
    });

    it('should return error for a 3-letter code', () => {
      expect(countryValidator(new FormControl('SVK'))).toEqual({ invalidCountries: true });
    });
  });

  describe('atLeastOneChecked', () => {
    it('should return null when at least one control is true', () => {
      const array = new FormArray([new FormControl(true), new FormControl(false)]);
      expect(atLeastOneChecked(array)).toBeNull();
    });

    it('should return error when all controls are false', () => {
      const array = new FormArray([new FormControl(false), new FormControl(false)]);
      expect(atLeastOneChecked(array)).toEqual({
        atLeastOneRequired: 'At least one message type must be selected.',
      });
    });
  });

  describe('atLeastOneInputFilled', () => {
    it('should return null when no parent', () => {
      expect(atLeastOneInputFilled(new FormControl(''))).toBeNull();
    });

    it('should return null when airports is filled', () => {
      const group = new FormGroup({
        airports:  new FormControl('EGLL'),
        countries: new FormControl(''),
      });
      expect(atLeastOneInputFilled(group.get('airports')!)).toBeNull();
    });

    it('should return null when countries is filled', () => {
      const group = new FormGroup({
        airports:  new FormControl(''),
        countries: new FormControl('SK'),
      });
      expect(atLeastOneInputFilled(group.get('countries')!)).toBeNull();
    });

    it('should return error when both are empty', () => {
      const group = new FormGroup({
        airports:  new FormControl(''),
        countries: new FormControl(''),
      });
      expect(atLeastOneInputFilled(group.get('airports')!)).toEqual({ atLeastOneRequired: true });
    });

    it('should return error when both contain only whitespace', () => {
      const group = new FormGroup({
        airports:  new FormControl('   '),
        countries: new FormControl('   '),
      });
      expect(atLeastOneInputFilled(group.get('airports')!)).toEqual({ atLeastOneRequired: true });
    });
  });
});
