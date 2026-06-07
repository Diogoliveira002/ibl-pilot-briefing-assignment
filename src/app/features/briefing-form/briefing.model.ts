import { AbstractControl, FormArray, ValidatorFn, ValidationErrors } from '@angular/forms';

export interface ReportType {
  label: string;
  apiValue: string;
}

export const REPORT_TYPES: ReportType[] = [
  { label: 'METAR',  apiValue: 'METAR'       },
  { label: 'SIGMET', apiValue: 'SIGMET'       },
  { label: 'TAF',    apiValue: 'TAF_LONGTAF'  },
];

export interface BriefingModel {
  messageTypes: boolean[];
  airports: string;
  countries: string;
}

export interface BriefingFieldConfig {
  key: keyof Omit<BriefingModel, 'messageTypes'>;
  label: string;
  placeholder: string;
  customErrors: Record<string, string>;
  validators: ValidatorFn[];
  uppercase?: boolean;
}

export function atLeastOneChecked(array: AbstractControl): ValidationErrors | null {
  const checked = (array as FormArray).controls.some(c => c.value === true);
  return checked ? null : { atLeastOneRequired: 'At least one message type must be selected.' };
}

export function atLeastOneInputFilled(control: AbstractControl): ValidationErrors | null {
  const parent = control.parent;
  if (!parent) return null;
  const airports  = parent.get('airports')?.value?.trim();
  const countries = parent.get('countries')?.value?.trim();
  return airports || countries ? null : { atLeastOneRequired: true };
}

export function airportValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value;
  if (!value) return null;
  const codes = value.split(' ').map(c => c.trim()).filter(Boolean);
  const invalid = codes.filter(c => !/^[A-Z]{4}$/.test(c));
  return invalid.length > 0 ? { invalidAirports: true } : null;
}

export function countryValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value;
  if (!value) return null;
  const codes = value.split(' ').map(c => c.trim()).filter(Boolean);
  const invalid = codes.filter(c => !/^[A-Z]{2}$/.test(c));
  return invalid.length > 0 ? { invalidCountries: true } : null;
}
