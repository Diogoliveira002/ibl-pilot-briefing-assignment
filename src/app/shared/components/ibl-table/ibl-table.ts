import { Component, Input, OnChanges } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { IblSpinner } from '../ibl-spinner/ibl-spinner';
import { IblTableCellTemplates, IblTableColumn, IblTableRow } from './ibl-table.model';

@Component({
  selector: 'ibl-table',
  imports: [MatTableModule, NgTemplateOutlet, IblSpinner],
  templateUrl: './ibl-table.html',
  styleUrl: './ibl-table.css',
})
export class IblTable implements OnChanges {
  @Input({ required: true }) columns: IblTableColumn[] = [];
  @Input({ required: true }) rows: IblTableRow[] = [];
  @Input() cellTemplates: IblTableCellTemplates = {};
  @Input() loading: boolean = false;
  @Input() hideHeader: boolean = false;
  
  protected displayedColumns: string[] = [];

  ngOnChanges(): void {
    this.displayedColumns = (this.columns ?? []).filter(Boolean).map(c => c.key);
  }
}
