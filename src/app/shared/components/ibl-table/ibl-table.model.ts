import { TemplateRef } from '@angular/core';

export interface IblTableColumn {
  key: string;
  label: string;
  html?: boolean;
  width?: string;
}

export type IblTableRow = Record<string, string | number>;

export type IblTableCellTemplates = Record<string, TemplateRef<{ $implicit: IblTableRow }>>;
