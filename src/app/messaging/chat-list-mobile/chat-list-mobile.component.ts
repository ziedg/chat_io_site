import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

import { User } from '../../beans/user';
import { LoginService } from '../../login/services/loginService';
import { ChatService } from '../../messanging/chat.service';
import { AppSettings } from '../../shared/conf/app-settings';
import * as pathUtils from '../../utils/path.utils';
import { EmitterService } from '../emitter.service';

declare var jQuery: any;

@Component({
  selector: 'app-chat-list-mobile',
  templateUrl: './chat-list-mobile.component.html',
  styleUrls: ['./chat-list-mobile.component.css']
})
export class ChatListMobileComponent implements OnInit {
  @Input() conversation: string;
  @Input() selectedUserInfo: string;

  private user;
  private userId: string = null;
  public chatListUsers: any[] = [];
  private selectedUserId: string = null;
//
autocomplete = false;
listSearchUsers = [];
searchValue: string;
noSearchResults: Boolean = false;
@ViewChild("searchBar") searchBar: ElementRef;

//
  constructor(
    private emitterService :EmitterService,
    private chatService:ChatService,
    private loginService :LoginService,
    private changeDetector: ChangeDetectorRef,
    private router:Router,
    private http: Http
  ) { }

   ngOnInit(){
    this.user =this.loginService.getUser();
    this.userId=this.user._id;
    this.getChatList();
    jQuery(".navigation-bottom").addClass('hidden-xs');
   }
  getChatList(){
    /*
     l'historique des personnes dont il a fait des conversations avec 
     sinon Les trois abonnements derniers des
     */
    this.chatService.getList(this.userId)
    .map(users=>{
    let results:Array<any>= users.json();
     return results.map((user)=>{
     return {
      _id:user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture
    }
     })
    })
    .subscribe((users:any[])=>{
       for(let i=0;i<users.length;i++){
       this.chatListUsers.push(users[i]);
       } 
   
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
    this.chatService.getMessages({ fromUserId: this.userId, toUserId: this.selectedUserId })
    .subscribe((response) => {
      /* Sending conversation between two users to other component. */
      this.emitterService.emitConversation(response);
  });
}

/*Search functionnality*/
loadUser(user) {
 
  var found = this.chatListUsers.some(function (profile) {
    return profile._id ==user._id ;
  });
    if (!found) this.chatListUsers.push(user)
  
  this.selectUser(user)
}

filterChatListUsersByName(name){
return this.chatListUsers.filter((user)=>{
let fullName=user.firstName +' ' +user.lastName;
return fullName.includes(name);
});
}

filterSubscriptionsByName(name){
  return this.user.subscriptions.filter((user)=>{
  let fullName=user.firstName + ' ' + user.lastName;
  return fullName.includes(name);
  });
  }

onFocus(){
    this.searchBar.nativeElement.style.display = "block!important";
    this.onChange(this.searchBar.nativeElement.value);
}

onChange(newValue: string) {
  console.log(newValue)
  this.listSearchUsers = [];
  this.enableAutocomplete();
  this.changeDetector.markForCheck();
  if (newValue.length > 1) {
      let searchInHistory=this.filterChatListUsersByName(newValue);
        if (searchInHistory && searchInHistory.length>0){
        this.listSearchUsers=searchInHistory
        }else{
         let searchInSubscriptions=this.filterSubscriptionsByName(newValue);
            if (searchInSubscriptions && searchInSubscriptions.length>0){
             this.listSearchUsers=searchInSubscriptions;
            }else{
              this.getListSearchUsers(newValue);
            }
    }
  } 
  this.changeDetector.markForCheck();
}



getListSearchUsers(key: string) {
  this.http
    .get(
      environment.SERVER_URL + pathUtils.FIND_PROFILE + key,
      AppSettings.OPTIONS
    )
    .map((res:Response)=>res.json())
    .subscribe(
      response => {
        this.listSearchUsers = [];
        this.noSearchResults = false;
        this.changeDetector.markForCheck();
        for (var i = 0; i < this.listSearchUsers.length; i++) {
          this.listSearchUsers.pop();
          this.changeDetector.markForCheck();
        }
        if (response.status == 0) {
          if (response.profiles)
            for (var i = 0; i < response.profiles.length; i++) {
              this.listSearchUsers[i] = response.profiles[i];
              this.changeDetector.markForCheck();
            }
        }
      },
      err => {
        this.noSearchResults = true;
      },
      () => {
        if (this.listSearchUsers.length == 0) {
          this.disableAutocomplete();
          this.noSearchResults = true;
        } else {
          this.noSearchResults = false;
        }
        this.changeDetector.markForCheck();
      }
    );
}


enableAutocomplete() {
  jQuery(".recherche-results-holder").show();
  jQuery(".upper-arrow-search").show();
  this.changeDetector.markForCheck();
}

disableAutocomplete() {
  jQuery(".recherche-results-holder-1").hide();
  jQuery(".upper-arrow-search").hide();
}
}
