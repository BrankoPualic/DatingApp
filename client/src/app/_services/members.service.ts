import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Member } from '../_models/member';
import { map, of } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { UserParams } from '../_models/userParams';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  members: Member[] = [];

  constructor(private dataService: DataService) {}

  getMembers(userParams: UserParams) {
    let params = this.getPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.getPaginatedResult<Member[]>('users', params);
  }

  private getPaginatedResult<T>(url: string, params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.dataService
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

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);

    return params;
  }

  getMember(username: string) {
    const member = this.members.find((x) => x.userName === username);
    if (member) return of(member);
    return this.dataService.get<Member>('users/' + username);
  }

  updateMember(member: Member) {
    return this.dataService.put('users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = { ...this.members[index], ...member };
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.dataService.put(`users/set-main-photo/${photoId}`, {});
  }

  deletePhoto(photoId: number) {
    return this.dataService.delete(`users/delete-photo/${photoId}`);
  }
}
