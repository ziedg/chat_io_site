import { Component, OnInit ,Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { User } from '../../beans/user';
import { EmitterService } from '../emitter.service';
import { ChatService } from '../../messanging/chat.service';
import { LoginService } from '../../login/services/loginService';
import {map} from 'rxjs/operators/map'
import { RecentRechService } from '../../main/services/recentRechService';
import { Router } from '@angular/router';
import { Http ,Response} from '@angular/http';
import { environment } from 'environments/environment';
import * as pathUtils from '../../utils/path.utils';
import { AppSettings } from '../../shared/conf/app-settings';

declare var jQuery: any;


@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {
  @Input() conversation: string;
  @Input() selectedUserInfo: string;

  private userId: string = null;
  public chatListUsers: any[] = [];
  private selectedUserId: string = null;
//
autocomplete = false;
listSearchUsers: Array<User> = [];
searchValue: string;
showRecentSearch: Boolean;
RecentSearchList;
noSearchResults: Boolean = false;
@ViewChild("searchResults2") searchRes2: ElementRef;
@ViewChild("searchMobileInput") searchInput: ElementRef;

//
  constructor(
    private emitterService :EmitterService,
    private chatService:ChatService,
    private loginService :LoginService,
    private recentRechService: RecentRechService,
    private changeDetector: ChangeDetectorRef,
    private router:Router,
    private http: Http
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
    let results:Array<any>= users.json();
     return results.map((user)=>{
     return {
      _id:user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
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
saveRecentRech(user) {
  console.log(user)
  console.log(this.chatListUsers)
  let newRechUser = {};
  newRechUser = JSON.stringify({
    _id:user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    profilePicture: user.profilePicture,
    profilePictureMin: user.profilePictureMin
  });
  this.recentRechService.addToListRecentRech(JSON.parse(<string>newRechUser));
  this.changeDetector.markForCheck();
  this.disableAutocomplete();
  this.RecentSearchList = this.recentRechService.getListRecentRech();
  var found = this.chatListUsers.some(function (profile) {
    return profile._id ==user._id ;
  });
    if (!found) this.chatListUsers.push(user)
  
  this.selectUser(user)
}

onChange(newValue: string) {
  this.listSearchUsers = [];
  this.enableAutocomplete();
  this.changeDetector.markForCheck();
  if (newValue.length > 1) {
    this.getListSearchUsers(newValue);
  } else {
    if (this.recentRechService.isEmptyList()) {
      this.disableAutocomplete();
    } else {
      this.showRecentSearchUsers();
    }
  }
  this.changeDetector.markForCheck();
}

onFocus() {
  this.searchRes2.nativeElement.style.display = "block!important";
  this.onChange(this.searchInput.nativeElement.value);
  this.checkAutoComplete();
}

showRecentSearchUsers() {
  if (this.recentRechService.isEmptyList()) {
    this.disableAutocomplete();
    this.showRecentSearch = false;
  } else {
    this.enableAutocomplete();
    this.RecentSearchList = this.recentRechService.getListRecentRech();
    this.showRecentSearch = true;
  }
  this.changeDetector.markForCheck();
}

getListSearchUsers(key: string) {
  this.showRecentSearch = false;
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

checkAutoComplete() {
  if (this.searchValue && this.searchValue.length > 1) {
    this.getListSearchUsers(this.searchValue);
  } else {
    this.enableAutocomplete();
    this.showRecentSearchUsers();
  }
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
