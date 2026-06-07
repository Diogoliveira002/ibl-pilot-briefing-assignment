import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IblSpinner } from '../ibl-spinner/ibl-spinner';

@Component({
  selector: 'ibl-button',
  imports: [MatButtonModule, MatProgressSpinnerModule, IblSpinner],
  templateUrl: './ibl-button.html',
  styleUrl: './ibl-button.css',
})
export class IblButton {
  @Input({ required: true }) label!: string;
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() type: '' | 'elevated' | 'outlined' | 'filled' | 'tonal' = '';

  @Output() onClick = new EventEmitter<void>();
}

