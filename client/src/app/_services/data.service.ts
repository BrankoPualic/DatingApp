import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  post<T>(url: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${url}`, data);
  }

  get<T>(url: string, options?: object): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${url}`, options);
  }

  put(url: string, obj: any) {
    return this.http.put(`${this.baseUrl}${url}`, obj);
  }

  delete(url: string) {
    return this.http.delete(`${this.baseUrl}${url}`);
  }
}
