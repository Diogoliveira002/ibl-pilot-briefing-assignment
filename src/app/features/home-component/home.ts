import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BriefingForm } from '../briefing-form/briefing-form';
import { BriefingModel, REPORT_TYPES } from '../briefing-form/briefing.model';
import { OpmetResult } from '../../core/models/opmet-result.model';
import { BriefingTableResults } from '../briefing-table-results/briefing-table-results';
import { IblButton } from '../../shared/components/ibl-button/ibl-button';
import { OpmetQueryService } from './services/opmet-query.service';

@Component({
  selector: 'app-home',
  imports: [IblButton, BriefingForm, BriefingTableResults],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  protected showForm = signal(false);
  protected loading = signal(false);
  protected error = signal<string | null>(null);
  protected warning = signal<string | null>(null);
  protected results = signal<OpmetResult[] | null>(null);

  private destroyRef = inject(DestroyRef);
  private opmetService = inject(OpmetQueryService);

  protected onShowForm(): void {
    this.showForm.set(true);
  }

  protected onFormClose(): void {
    this.showForm.set(false);
  }

  protected onFormSuccess(briefing: BriefingModel): void {
    this.loading.set(true);
    this.error.set(null);
    this.warning.set(null);

    const selectedApiValues = REPORT_TYPES
      .filter((_, i) => briefing.messageTypes[i])
      .map(r => r.apiValue);

    this.opmetService
      .query(briefing, selectedApiValues)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (results) => {

          if(results.length === 0) {
            this.warning.set('No results found for the given criteria.');
          }

          this.results.set(results);
          this.loading.set(false);
        },
        error: (err: Error) => {
          this.error.set(err.message);
          this.loading.set(false);
        },
      });
  }
}
