import { Component, inject, Input, signal, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'ibl-input',
  imports: [MatFormFieldModule, MatInputModule, MatError],
  templateUrl: './ibl-input.html',
  styleUrl: './ibl-input.css'
})
export class IblInput implements ControlValueAccessor {
  @ViewChild(MatInput) private matInput?: MatInput;

  @Input({ required: true }) label!: string;
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() required: boolean = false;
  @Input() appearance: 'fill' | 'outline' = 'fill';
  @Input() hint: string = '';
  @Input() customErrors: Record<string, string> = {};

  protected value = signal<string>('');
  protected isDisabled = signal<boolean>(false);

  protected ngControl = inject(NgControl, { self: true, optional: true });

  protected errorStateMatcher: ErrorStateMatcher = {
    isErrorState: (_control, _form) => this.invalid,
  };

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngDoCheck(): void {
    this.matInput?.updateErrorState();
  }

  get errors() {
    return this.ngControl?.control?.errors;
  }

  get customErrorEntries(): { key: string; message: string }[] {
    return Object.entries(this.customErrors).map(([key, message]) => ({ key, message }));
  }

  get invalid(): boolean {
    const c = this.ngControl?.control;
    return !!c?.invalid && !!(c.dirty || c.touched);
  }

  // ControlValueAccessor methods

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
  
  protected handleChange(value: string): void {
    this.value.set(value);
    this.onChange(value);
  }

  protected handleBlur(): void {
    this.onTouched();
  }
}
