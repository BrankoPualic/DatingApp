import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private dataService: DataService) {}

  getUsersWithRoles() {
    return this.dataService.get<User[]>('admin/users-with-roles');
  }

  updateUserRoles(username: string, roles: string[]) {
    return this.dataService.post<string[]>(
      `admin/edit-roles/${username}?roles=${roles}`,
      {}
    );
  }
}
