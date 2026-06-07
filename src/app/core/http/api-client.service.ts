import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JsonRpcRequest, JsonRpcResponse } from '../models/json-rpc.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.opmetQueryUrl;
  private requestId = 0;

  get<TResult>(path: string, queryParams?: Record<string, string>): Observable<TResult> {
    const params = queryParams ? new HttpParams({ fromObject: queryParams }) : undefined;
    return this.http.get<TResult>(`${this.baseUrl}${path}`, { params });
  }

  post<TBody, TResult>(path: string, body: TBody): Observable<TResult> {
    return this.http.post<TResult>(`${this.baseUrl}${path}`, body);
  }

  // JSON-RPC: uses post internally, wraps request and unwraps response
  call<TParams, TResult>(method: string, params: TParams): Observable<TResult> {
    const request: JsonRpcRequest<TParams> = {
      id: String(++this.requestId),
      method,
      params: [params],
    };

    return this.post<JsonRpcRequest<TParams>, JsonRpcResponse<TResult>>('', request).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return response.result as TResult;
      }),
    );
  }
}
