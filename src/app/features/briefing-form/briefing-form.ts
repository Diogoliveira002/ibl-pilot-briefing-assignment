import { Component, DestroyRef, EventEmitter, inject, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IblCard } from '../../shared/components/ibl-card/ibl-card';
import { IblInput } from '../../shared/components/ibl-input/ibl-input';
import { IblButton } from '../../shared/components/ibl-button/ibl-button';
import { IblCheckbox } from '../../shared/components/ibl-checkbox/ibl-checkbox';
import { ValidationDialogService } from '../../shared/services/validation-dialog.service';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  airportValidator,
  atLeastOneChecked,
  atLeastOneInputFilled,
  BriefingFieldConfig,
  BriefingModel,
  countryValidator,
  REPORT_TYPES,
} from './briefing.model';

@Component({
  selector: 'app-briefing-form',
  imports: [IblCard, IblInput, IblButton, IblCheckbox, ReactiveFormsModule],
  templateUrl: './briefing-form.html',
  styleUrl: './briefing-form.css',
})
export class BriefingForm {
  @Input() loading: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<BriefingModel>();

  protected readonly reportTypes = REPORT_TYPES;

  protected readonly fields: BriefingFieldConfig[] = [
    {
      key: 'airports',
      label: 'Airports',
      placeholder: 'Enter airport codes separated by space (e.g. EGLL LZIB)',
      validators: [airportValidator, atLeastOneInputFilled],
      uppercase: true,
      customErrors: {
        invalidAirports: 'Each code must be 4 letters.',
        atLeastOneRequired: 'At least one of Airport or Country must be filled.',
      },
    },
    {
      key: 'countries',
      label: 'Countries',
      placeholder: 'Enter country codes separated by space (e.g. SK GB)',
      validators: [countryValidator, atLeastOneInputFilled],
      uppercase: true,
      customErrors: {
        invalidCountries: 'Each code must be 2 letters.',
        atLeastOneRequired: 'At least one of Airport or Country must be filled.',
      },
    },
  ];

  protected briefingForm!: FormGroup;

  private destroyRef = inject(DestroyRef);
  private confirmationDialog = inject(ValidationDialogService);

  constructor() {
    this.createForm();
  }

  private createForm(): void {
    const controls: Record<string, AbstractControl> = {
      messageTypes: new FormArray(
        this.reportTypes.map(() => new FormControl(false)),
        atLeastOneChecked,
      ),
    };

    for (const field of this.fields) {
      controls[field.key] = new FormControl('', field.validators);
    }

    this.briefingForm = new FormGroup(controls);

    for (const field of this.fields) {
      const control = this.briefingForm.get(field.key) as FormControl;
      control.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value: string) => {
          if (field.uppercase) {
            const upper = value?.toUpperCase();
            if (upper !== value) control.setValue(upper, { emitEvent: false });
          }
          this.fields
            .filter(f => f.key !== field.key)
            .forEach(f => this.briefingForm.get(f.key)?.updateValueAndValidity({ emitEvent: false }));
        });
    }

    
  }

  protected _onSubmit(): void {
    if (this.briefingForm.invalid) {
      this.briefingForm.markAllAsTouched();
      return;
    }

    this.confirmationDialog
      .confirm('Confirm submission', 'Submit the briefing criteria?')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed: boolean) => {
        if (!confirmed) return;
        this.success.emit(this.briefingForm.value as BriefingModel);
        this._resetFormState();
      });
  }

  protected _onCancel(): void {
    if (!this.briefingForm.dirty) {
      this.close.emit();
      return;
    }

    this.confirmationDialog
      .discard('You have unsaved changes. Do you want to discard them?')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this._resetFormState();
          this.close.emit();
        }
      });
  }

  private _resetFormState(): void {
    this.briefingForm.reset();
  }

  private get messageTypesArray(): FormArray {
    return this.briefingForm.get('messageTypes') as FormArray;
  }

  protected get messageTypesInvalid(): boolean {
    const c = this.messageTypesArray;
    return c.invalid && (c.dirty || c.touched);
  }

  protected get messageTypesError() {
    return this.messageTypesArray.errors;
  }
}
