import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  constructor(private dataService: DataService) {}

  getMembers() {
    return this.dataService.get<Member[]>('users');
  }

  getMember(username: string) {
    return this.dataService.get<Member>('users/' + username);
  }
}
