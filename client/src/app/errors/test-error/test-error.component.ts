import { Component, inject } from '@angular/core';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.css'],
})
export class TestErrorComponent {
  api = inject(DataService);
  validationErrors: string[] = [];

  get404Error() {
    this.api.get('buggy/not-found').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.error(error),
    });
  }
  get400Error() {
    this.api.get('buggy/bad-request').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.error(error),
    });
  }
  get500Error() {
    this.api.get('buggy/server-error').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.error(error),
    });
  }
  get401Error() {
    this.api.get('buggy/auth').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.error(error),
    });
  }
  get400ValidationError() {
    this.api.post('account/register', {}).subscribe({
      next: (response) => console.log(response),
      error: (error) => {
        console.error(error);
        this.validationErrors = error;
      },
    });
  }
}
