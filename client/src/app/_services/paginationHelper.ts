import { HttpParams, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { DataService } from './data.service';

export function getPaginatedResult<T>(
  url: string,
  params: HttpParams,
  dataService: DataService
) {
  const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
  return dataService
    .get<HttpResponse<T>>(url, { observe: 'response', params })
    .pipe(
      map((response) => {
        if (response.body) paginatedResult.result = response.body;
        const pagination = response.headers.get('Pagination');
        if (pagination) paginatedResult.pagination = JSON.parse(pagination);
        return paginatedResult;
      })
    );
}

export function getPaginationHeaders(pageNumber: number, pageSize: number) {
  let params = new HttpParams();

  params = params.append('pageNumber', pageNumber);
  params = params.append('pageSize', pageSize);

  return params;
}
