import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IblTable } from '../../shared/components/ibl-table/ibl-table';
import { IblTableColumn, IblTableRow } from '../../shared/components/ibl-table/ibl-table.model';
import { OpmetResult } from '../../core/models/opmet-result.model';

interface StationGroup {
  stationId: string;
  columns: IblTableColumn[];
  rows: IblTableRow[];
}

const DATE_FORMAT = new Intl.DateTimeFormat('sk-SK', {
  year:   'numeric',
  month:  '2-digit',
  day:    '2-digit',
  hour:   '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
});

@Component({
  selector: 'app-briefing-table-results',
  imports: [IblTable],
  templateUrl: './briefing-table-results.html',
  styleUrl: './briefing-table-results.css',
})
export class BriefingTableResults implements OnChanges {
  @Input({ required: true }) results: OpmetResult[] | null = null;
  @Input() loading: boolean = false;

  protected groups: StationGroup[] = [];

  ngOnChanges(simpleChanges: SimpleChanges): void {

    let checkResults = simpleChanges['results']?.currentValue as OpmetResult[] | null;

    if(checkResults === null || checkResults.length === 0) {
      this.groups = [];
      return;
    }

    this.mapResultsToGroups();
  }

  private mapResultsToGroups(): void {
    const map = new Map<string, IblTableRow[]>();

    for (const r of (this.results ?? [])) {
      const rows = map.get(r.stationId) ?? [];
      rows.push({
        reportType: r.reportType,
        reportTime: DATE_FORMAT.format(new Date(r.reportTime)),
        textHTML:   r.textHTML,
      });
      map.set(r.stationId, rows);
    }

    this.groups = Array.from(map.entries()).map(([stationId, rows]) => ({
      stationId,
      rows,
      columns: [
        { key: 'reportType', label: stationId, width: '15%'  },
        { key: 'reportTime', label: '',         width: '15%'  },
        { key: 'textHTML',   label: '',         width: '70%', html: true },
      ],
    }));
  }
}
