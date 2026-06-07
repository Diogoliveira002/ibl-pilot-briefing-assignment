import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { IblDialog } from '../components/ibl-dialog/ibl-dialog';
import { IblDialogData } from '../components/ibl-dialog/ibl-dialog.model';

@Injectable({ providedIn: 'root' })
export class ValidationDialogService {
  private dialog = inject(MatDialog);

  confirm(title: string, message: string): Observable<boolean> {
    const data: IblDialogData = {
      title,
      message,
      actions: [
        { label: 'Cancel',  result: false, type: 'outlined' },
        { label: 'Confirm', result: true,  type: 'tonal'    },
      ],
    };
    return this.dialog.open(IblDialog, { data }).afterClosed();
  }

  discard(message: string): Observable<boolean> {
    const data: IblDialogData = {
      title: 'Discard changes?',
      message,
      actions: [
        { label: 'No',  result: false, type: 'outlined' },
        { label: 'Yes', result: true,  type: 'tonal'    },
      ],
    };
    return this.dialog.open(IblDialog, { data }).afterClosed();
  }
}
