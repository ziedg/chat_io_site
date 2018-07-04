import { ChatService } from './../../messanging/chat.service';
import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';


import { LoginService } from 'app/login/services/loginService';

@Injectable()
export class MessageResolver implements Resolve<any> {
  private user;
  private userId: string = null;
  
  constructor(
              private chatService: ChatService,
              private loginService :LoginService,
               ) {
                this.user =this.loginService.getUser();
                this.userId=this.user._id;
                
               }

  
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let selectedUserId = route.paramMap.get('stringid');
    
    return this.chatService.getMessages({ fromUserId: this.userId, toUserId: selectedUserId });
    
    
    
  }
}