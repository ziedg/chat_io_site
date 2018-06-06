import { Component, OnInit ,Input } from '@angular/core';
import { User } from '../../beans/user';
import { EmitterService } from '../emitter.service';
import { ChatService } from '../../messanging/chat.service';
import { LoginService } from '../../login/services/loginService';
import {map} from 'rxjs/operators/map'

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {
  @Input() conversation: string;
  @Input() selectedUserInfo: string;

  private userId: string = null;
  public chatListUsers: User[] = [];
  private selectedUserId: string = null;

  constructor(
    private emitterService :EmitterService,
    private chatService:ChatService,
    private loginService :LoginService
  ) { }

   ngOnInit(){
   let user =this.loginService.getUser();
   this.userId=user._id;
   this.getChatList();

   }
  getChatList(){
    /*
     l'historique des personnes dont il a fait des conversations avec 
     sinon Les trois abonnements derniers des
     */
    this.chatService.getList(this.userId)
    .map(users=>{
     return users.json();
    })
    .subscribe((users:any)=>{
      users.forEach(user => {
        this.chatListUsers.push(user)
      });
    })
  }

  isUserSelected(userId: string): boolean {
    if (!this.selectedUserId) {
        return false;
    }
    return this.selectedUserId === userId ? true : false;
}
 
/* Method to select the user from the Chat list starts */
selectUser(user: User): void {
    this.selectedUserId = user._id;

     /* Sending selected users information to other component. */
     this.emitterService.emitUser(user);

      /* calling method to get the messages */
    this.chatService.getMessages({ userId: this.userId, toUserId: user._id })
    .subscribe((response) => {
      console.log(response)
      /* Sending conversation between two users to other component. */
      this.emitterService.emitConversation(response);
  });
}



}
