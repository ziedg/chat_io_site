import { getRawMessage } from 'codelyzer/angular/styles/cssLexer';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from 'environments/environment';
import * as pathUtils from '../utils/path.utils';


@Injectable()
export class ChatService {
ServerUrl ;
  constructor(
    private http :Http
  ) { 
    this.ServerUrl=environment.SERVER_URL;
  }

  //get the chat list 
getList(userId){
return this.http.get(`${this.ServerUrl}${pathUtils.GET_CHAT_LIST_SUGGESTIONS}`+userId);
}

getMessages(users){
/* get messages between current user and the selected user from the list*/
return this.http.get(`${this.ServerUrl}${pathUtils.GET_CHAT_MESSAGES}`+users.fromUserId+'/'+users.toUserId)
.map((response)=>{
return response.json()
});

}
}
