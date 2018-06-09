import { Component, OnInit, ViewChild } from '@angular/core';
import { SocketService } from '../main/services/socket.service';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ConversationComponent } from './conversation/conversation.component';
import { LoginService } from '../login/services/loginService';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {
user;
public overlayDisplay = true;

  public conversation = 'CONVERSATION';
  public selectedUserInfo = 'SELECTEDUSERINFO';

  @ViewChild('chatList') chatListComponent: ChatListComponent;
  @ViewChild('conversation') conversationComponent: ConversationComponent;
  
  constructor(
    private socketService :SocketService,
    private loginService:LoginService
  ) { 
}
  
ngOnInit(){
  this.loginService.redirect();
  this.user=this.loginService.getUser();
  //connect to socket
  console.log('connect to socket')
  this.socketService.connectSocket(this.user._id);

  
  /* Calling Compoenent method to Listen for Incoming Messages*/
  this.conversationComponent.listenForMessages(this.user._id);
}

}
