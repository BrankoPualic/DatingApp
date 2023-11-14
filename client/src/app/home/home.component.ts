import { Component, OnInit } from '@angular/core';
import { DataService } from '../_services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  registerMode = false;
  users: any;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  getUsers() {
    this.dataService.get('users').subscribe({
      next: (response: any) => (this.users = response),
      error: (error) => console.error(error),
    });
  }

  cancelRegister(event: boolean) {
    this.registerMode = event;
  }
}
