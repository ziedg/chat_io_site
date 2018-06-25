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
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {
  @Input() conversation: string;
  @Input() selectedUserInfo: string;

  private user;
  private userId: string = null;
  public chatListUsers: any[] = [];
  public suggestions: any[] = [];
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
    this.getSuggestionsList();
    jQuery(".navigation-bottom").addClass('hidden-xs');
   }
  getChatList(){
    /*
     l'historique des personnes dont il a fait des conversations avec +dernier message pour chacun
     */
    this.chatService.getList(this.userId)
    .map(users=>{
     return users.json();
     })
    .subscribe((users:any[])=>{
      console.log(users)
       for(let i=0;i<users.length;i++){
          if(users[i].lastMessage.fromUserId == this.userId){
            users[i].lastMessage.message = "Vous : "+users[i].lastMessage.message;
          }
          let dateMsg = new Date(users[i].lastMessage.date);
          let actualDate = new Date(Date.now());
          let year = dateMsg.getFullYear();
          let month = dateMsg.getMonth() + 1;
          let day = dateMsg.getDate();
          if((actualDate.getFullYear() - year > 0)||
            ((actualDate.getMonth()+1) - month > 0)||
            (actualDate.getDate() - day > 0)){
            users[i].lastMessage.date = day +"-"+month+"-"+year;
          }else{
            let hours;
            let minutes;
            if(dateMsg.getHours().toString().length==1){
              hours = "0"+dateMsg.getHours().toString();
            }else{
              hours = dateMsg.getHours().toString();
            }
            if(dateMsg.getMinutes().toString().length==1){
              minutes = "0"+dateMsg.getMinutes().toString();
            }else{
              minutes = dateMsg.getMinutes().toString();
            }
            users[i].lastMessage.date = hours+":"+minutes;
          }
          this.chatListUsers.push(users[i]);
       } 
   
    })
  }
  getSuggestionsList(){
    /*
     les abonnées dont il n'a pas fait des conversations avec encore
     */
    this.chatService.getSuggestions(this.userId)
    .map(users=>{
     return users.json();
     })
    .subscribe((users:any[])=>{
      console.log(users)
       for(let i=0;i<users.length;i++){
       this.suggestions.push(users[i]);
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
  return this.user.subscriptionsDetails.filter((user)=>{
  let fullName=user.firstName + ' ' + user.lastName;
  return fullName.includes(name);
  });
  }

onFocus(){
    this.searchBar.nativeElement.style.display = "block!important";
    this.onChange(this.searchBar.nativeElement.value);
}

onChange(newValue: string) {
  this.listSearchUsers = [];
  this.enableAutocomplete();
  this.changeDetector.markForCheck();
  if (newValue.length >=1) {
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
