import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Member } from '../_models/member';
import { map, of } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { HttpParams, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  members: Member[] = [];
  paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>();

  constructor(private dataService: DataService) {}

  getMembers(page?: number, itemsPerPage?: number) {
    let params = new HttpParams();

    if (page && itemsPerPage) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.dataService
      .get<HttpResponse<Member[]>>('users', { observe: 'response', params })
      .pipe(
        map((response) => {
          if (response.body) this.paginatedResult.result = response.body;
          const pagination = response.headers.get('Pagination');
          if (pagination)
            this.paginatedResult.pagination = JSON.parse(pagination);
          return this.paginatedResult;
        })
      );
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
