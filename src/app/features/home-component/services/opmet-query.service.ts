import { inject, Injectable } from '@angular/core';
import { Observable, timeout } from 'rxjs';
import { ApiClient } from '../../../core/http/api-client.service';
import { BriefingModel } from '../../briefing-form/briefing.model';
import { OpmetQueryParams, OpmetResult } from '../../../core/models/opmet-result.model';

@Injectable({ providedIn: 'root' })
export class OpmetQueryService {
  private apiClient = inject(ApiClient);

  query(briefing: BriefingModel, reportTypes: string[]): Observable<OpmetResult[]> {
    const stations = briefing.airports
      .split(' ')
      .map(s => s.trim())
      .filter(Boolean);

    const countries = briefing.countries
      .split(' ')
      .map(s => s.trim())
      .filter(Boolean);

    const params: OpmetQueryParams = {
      reportTypes,
      ...(stations.length  && { stations  }),
      ...(countries.length && { countries }),
    };

    return this.apiClient.call<OpmetQueryParams, OpmetResult[]>('query', params).pipe(timeout(10000));
  }
}
