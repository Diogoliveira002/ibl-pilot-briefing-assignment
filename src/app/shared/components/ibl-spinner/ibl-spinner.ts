import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule, ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'ibl-spinner',
  imports: [MatProgressSpinnerModule],
  templateUrl: './ibl-spinner.html',
  styleUrl: './ibl-spinner.css',
})
export class IblSpinner {

  @Input() mode: ProgressSpinnerMode = 'indeterminate';
  @Input() value: number = 50;
  @Input() diameter: 10 | 20 | 30 | 40 = 20 ;
}
