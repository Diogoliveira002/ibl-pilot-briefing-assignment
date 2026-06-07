import { Component, forwardRef, Input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'ibl-checkbox',
  imports: [MatCheckboxModule],
  templateUrl: './ibl-checkbox.html',
  styleUrl: './ibl-checkbox.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IblCheckbox),
      multi: true,
    },
  ],
})
export class IblCheckbox implements ControlValueAccessor {
  @Input({ required: true }) label!: string;
  @Input() required: boolean = false;
  @Input() indeterminate: boolean = false;
  @Input() labelPosition: 'before' | 'after' = 'after';

  protected value = signal<boolean>(false);
  protected isDisabled = signal<boolean>(false);

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: boolean): void {
    this.value.set(value ?? false);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  protected handleChange(checked: boolean): void {
    this.value.set(checked);
    this.onChange(checked);
    this.onTouched();
  }
}
