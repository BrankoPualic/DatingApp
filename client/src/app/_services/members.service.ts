import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Member } from '../_models/member';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  members: Member[] = [];

  constructor(private dataService: DataService) {}

  getMembers() {
    if (this.members.length > 0) return of(this.members);
    return this.dataService.get<Member[]>('users').pipe(
      map((members) => {
        this.members = members;
        return members;
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
}
