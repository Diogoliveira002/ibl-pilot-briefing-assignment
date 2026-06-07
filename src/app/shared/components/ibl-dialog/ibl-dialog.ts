import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IblButton } from '../ibl-button/ibl-button';
import { IblDialogData } from './ibl-dialog.model';

@Component({
  selector: 'ibl-dialog',
  imports: [MatDialogModule, IblButton],
  templateUrl: './ibl-dialog.html',
  styleUrl: './ibl-dialog.css',
})
export class IblDialog {
  data = inject<IblDialogData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<IblDialog>);

  close(result: unknown): void {
    this.dialogRef.close(result);
  }
}
