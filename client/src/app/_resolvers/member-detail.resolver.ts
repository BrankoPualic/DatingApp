import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { MembersService } from '../_services/members.service';
import { Member } from '../_models/member';
import { Observable } from 'rxjs';

export const memberDetailResolver: ResolveFn<Member> = (
  route
): Observable<Member> => {
  return inject(MembersService).getMember(route.paramMap.get('username')!);
};
