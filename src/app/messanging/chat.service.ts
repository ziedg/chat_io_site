//import { getRawMessage } from 'codelyzer/angular/styles/cssLexer';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import * as pathUtils from '../utils/path.utils';
import { AppSettings } from '../shared/conf/app-settings';
import { Subject } from 'rxjs';


@Injectable()
export class ChatService {
  messageEmitter = new Subject<any>();
  ServerUrl;
  constructor(
    private http: Http
  ) {
    this.ServerUrl = environment.SERVER_URL;
  }

  //get the chat list (historique)
  getList(userId) {
    return this.http.get(`${this.ServerUrl}${pathUtils.GET_CHAT_LIST}` + userId);
  }

  //get suggestions
  getSuggestions(userId) {
    return this.http.get(`${this.ServerUrl}${pathUtils.GET_MESSAGING_SUGGESTIONS}` + userId);
  }

  getMessages(users, lastMessageId?) {
    /* get messages between current user and the selected user from the list*/
    if (!lastMessageId) {
      return this.http.get(`${this.ServerUrl}${pathUtils.GET_CHAT_MESSAGES}` + users.fromUserId + '/' + users.toUserId)
        .map((response) => {
          return response.json();

        });
    } else {
      return this.http.get(`${this.ServerUrl}${pathUtils.GET_CHAT_MESSAGES}` + users.fromUserId + '/' + users.toUserId + '/' + lastMessageId)
        .map((response) => {
          return response.json();

        });
    }


  }

  getMessage(msgId) {
    return this.http.get(`${this.ServerUrl}${pathUtils.GET_CHAT_MESSAGES}` + msgId)
      .map((response) => {
        return response.json()
      });

  }

  sendMessage(msg) {
    return this.http.post(`${this.ServerUrl}${pathUtils.GET_CHAT_MESSAGES}`, msg, AppSettings.OPTIONS);
  }

  markMessageAsSeen(msgId) {
    return this.http.put(`${this.ServerUrl}${pathUtils.GET_CHAT_MESSAGES}` + msgId, '')
      .map((response) => {
        return response.json()
      });
  }
  newIncomingMessage(message) {
    this.messageEmitter.next(message)
  }


}
