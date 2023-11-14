import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private dataService: DataService) {}

  login(model: any) {
    return this.dataService.post<User>('account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) localStorage.setItem('user', JSON.stringify(user));
        this.setCurrentUser(user);
      })
    );
  }

  register(model: any) {
    return this.dataService.post<User>('account/register', model).pipe(
      map((user) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
        return user;
      })
    );
  }

  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
