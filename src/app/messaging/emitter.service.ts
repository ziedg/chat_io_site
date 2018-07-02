import { Injectable, EventEmitter } from '@angular/core';
import { User } from '../beans/user';

@Injectable()
export class EmitterService {

userEmitter=new EventEmitter<User>();
conversationEmitter =new EventEmitter<any>();

public user: User; 
constructor() { }

  emitUser(user){
    this.userEmitter.emit(user);
    }
    
    emitConversation(conversation){
      this.conversationEmitter.emit(conversation);
      }

}

