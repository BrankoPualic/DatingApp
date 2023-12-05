import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { DataService } from './data.service';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { Message } from '../_models/message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private dataService: DataService) {}

  getMessages(pageNumbers: number, pageSize: number, container: string) {
    let params = getPaginationHeaders(pageNumbers, pageSize);
    params = params.append('container', container);
    return getPaginatedResult<Message[]>('messages', params, this.dataService);
  }

  getMessageThread(username: string) {
    return this.dataService.get<Message[]>('messages/thread/' + username);
  }

  sendMessage(username: string, content: string) {
    return this.dataService.post<Message>('messages', {
      recipientUsername: username,
      content,
    });
  }
}
