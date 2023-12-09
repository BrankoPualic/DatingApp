import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { DataService } from './data.service';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { Message } from '../_models/message';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../_models/user';
import { BehaviorSubject, take } from 'rxjs';
import { Group } from '../_models/group';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(private dataService: DataService) {}

  createHubConnection(user: User, otherUsername: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}message?user=${otherUsername}`, {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => console.error(error));

    this.hubConnection.on('ReceiveMessageThread', (messages) => {
      this.messageThreadSource.next(messages);
    });

    this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some((x) => x.username === otherUsername)) {
        this.messageThread$.pipe(take(1)).subscribe({
          next: (messages) => {
            messages.forEach((message) => {
              if (!message.dateRead) {
                message.dateRead = new Date(Date.now());
              }
            });
            this.messageThreadSource.next([...messages]);
          },
        });
      }
    });

    this.hubConnection.on('NewMessage', (message) => {
      this.messageThread$.pipe(take(1)).subscribe({
        next: (messages) =>
          this.messageThreadSource.next([...messages, message]),
      });
    });
  }

  stopHubConnection() {
    if (this.hubConnection) this.hubConnection.stop();
  }

  getMessages(pageNumbers: number, pageSize: number, container: string) {
    let params = getPaginationHeaders(pageNumbers, pageSize);
    params = params.append('container', container);
    return getPaginatedResult<Message[]>('messages', params, this.dataService);
  }

  getMessageThread(username: string) {
    return this.dataService.get<Message[]>('messages/thread/' + username);
  }

  async sendMessage(username: string, content: string) {
    return this.hubConnection
      ?.invoke('SendMessage', {
        recipientUsername: username,
        content,
      })
      .catch((error) => console.error(error));
  }

  deleteMessage(id: number) {
    return this.dataService.delete(`messages/${id}`);
  }
}
