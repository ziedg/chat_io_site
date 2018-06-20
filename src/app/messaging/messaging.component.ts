import 'rxjs/add/operator/map';

import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';

import { LoginService } from '../login/services/loginService';
import { RecentRechService } from '../main/services/recentRechService';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ConversationComponent } from './conversation/conversation.component';

declare var jQuery: any;
@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {
user;

  public conversation = 'CONVERSATION';
  public selectedUserInfo = 'SELECTEDUSERINFO';

  @ViewChild('chatList') chatListComponent: ChatListComponent;
  @ViewChild('conversation') conversationComponent: ConversationComponent;
  

  constructor(
    private loginService:LoginService,
    private recentRechService: RecentRechService,
    private changeDetector: ChangeDetectorRef,
    private router:Router,
    private http: Http
  ) { 
}
  
ngOnInit(){
  this.loginService.redirect();
  this.user=this.loginService.getUser();
  //connect to socket
  /*console.log('connect to socket')
  this.socketService.connectSocket(this.user._id);*/

  
  /* Calling Compoenent method to Listen for Incoming Messages*/
  this.conversationComponent.listenForMessages(this.user._id);
}


}