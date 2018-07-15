import { Http } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';
import { User } from '../beans/user';

@Injectable()
export class EmitterService {

userEmitter=new EventEmitter<User>();
conversationEmitter =new EventEmitter<any>();
lastMessageEmitter=new EventEmitter<any>();
public selectedUser: User;
  constructor(private _http:Http) { }

  emitUser(user){
    this.selectedUser=user
    this.userEmitter.emit(user);
    }

  emitConversation(conversation){
    this.conversationEmitter.emit(conversation);
    }

  getSelectedUser(){
    return this.selectedUser;
  }

  updateLastMessage(message){
this.lastMessageEmitter.emit(message)
}

}
