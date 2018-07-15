import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

import { User } from '../../beans/user';
import { LoginService } from '../../login/services/loginService';
import { ChatService } from '../../messanging/chat.service';
import { AppSettings } from '../../shared/conf/app-settings';
import * as pathUtils from '../../utils/path.utils';
import { EmitterService } from '../emitter.service';
import { AngularFireObject, AngularFireDatabase } from 'angularfire2/database';

declare var jQuery: any;


@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {
  @Input() conversation: string;
  @Input() selectedUserInfo: string;
  private notread: boolean;
  private user;
  private userId: string = null;
  public chatListUsers: any[] = [];
  public historyUsers: any[] = [];
  public suggestions: any[] = [];
  private selectedUserId: string = null;
  private s: AngularFireObject<any>;
  private msgFirstCheck: Boolean = true;
  //
  autocomplete = false;
  listSearchUsers = [];
  searchValue: string;
  noSearchResults: Boolean = false;
  @ViewChild("searchBar") searchBar: ElementRef;

  //
  constructor(
    private emitterService: EmitterService,
    private chatService: ChatService,
    private loginService: LoginService,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private db: AngularFireDatabase,
    private http: Http
  ) { }

  ngOnInit() {
    this.user = this.loginService.getUser();
    this.userId = this.user._id;
    this.getLoggedInUser(this.userId)
    this.getChatList();
    this.getSuggestionsList();
    this.reactToNewMessages();
    //this.listenForAllMessages(this.userId);
    this.updateMyMessages();
    this.updateLastMessage()
    jQuery(".navigation-bottom").addClass('hidden-xs');

    jQuery(document).click(function (e) {
      if (
        jQuery(e.target).closest(".recherche-results-holder-msg").length === 0
      ) {
        jQuery(".recherche-results-holder-msg").hide();
        jQuery(".upper-arrow-search-msg").hide();
      }
    });

  }

updateLastMessage(){
  this.emitterService.lastMessageEmitter.subscribe((msg)=>{
    var elementPos = this.historyUsers.map(function (user) { return user._id }).indexOf(msg.fromUserId)
    console.log(elementPos)
this.historyUsers[elementPos].lastMessage.message=msg.message

let actualDate = new Date(Date.now());
      let hours = actualDate.getHours().toString();
      let minutes = actualDate.getMinutes().toString();
      console.log(actualDate);
      if (hours.length == 1) {
        hours = "0" + hours;
      }
      if (minutes.length == 1) {
        minutes = "0" + minutes;
      }

      this.historyUsers[elementPos].lastMessage.date = hours + ":" + minutes;
      this.chatListUsers=this.historyUsers.slice()
  })
}
  updateMyMessages() {
    this.emitterService.myMessageEmitter.subscribe((data) => {
      var elementPos = this.historyUsers.map(function (x) { return x.lastMessage.toUserId; }).indexOf(this.selectedUserId);

      if (this.historyUsers[elementPos] == undefined) {
        elementPos = this.historyUsers.map(function (x) { return x.lastMessage.fromUserId; }).indexOf(this.selectedUserId);
      }

      this.historyUsers[elementPos].lastMessage.message = "Vous : " + data.message;

      let actualDate = new Date(Date.now());
      let hours = actualDate.getHours().toString();
      let minutes = actualDate.getMinutes().toString();
      console.log(actualDate);
      if (hours.length == 1) {
        hours = "0" + hours;
      }
      if (minutes.length == 1) {
        minutes = "0" + minutes;
      }

      this.historyUsers[elementPos].lastMessage.date = hours + ":" + minutes;
      this.chatListUsers=this.historyUsers.slice()
    });
  }



  getLoggedInUser(userId) {
    this.http.get(
      environment.SERVER_URL + pathUtils.GET_PROFILE + userId,
      AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {

          if (response.status == "0") {

            this.user = response.user;
          }

        },
        err => {
        },
        () => {
          this.changeDetector.markForCheck();
        }
      );
  }
  getChatList() {
    /*
     l'historique des personnes dont il a fait des conversations avec +dernier message pour chacun
     */
    this.chatService.getList(this.userId)
      .map(users => {
        return users.json();
      })
      .subscribe((users: any[]) => {
        for (let i = 0; i < users.length; i++) {
          if (users[i].lastMessage.fromUserId == this.userId) {
            users[i].lastMessage.message = "Vous : " + users[i].lastMessage.message;
          }
          let dateMsg = new Date(users[i].lastMessage.date);
          let actualDate = new Date(Date.now());
          let year = dateMsg.getFullYear();
          let month = dateMsg.getMonth() + 1;
          let day = dateMsg.getDate();
          if ((actualDate.getFullYear() - year > 0) ||
            ((actualDate.getMonth() + 1) - month > 0) ||
            (actualDate.getDate() - day > 0)) {
            users[i].lastMessage.date = day + "-" + month + "-" + year;
          } else {
            let hours;
            let minutes;
            if (dateMsg.getHours().toString().length == 1) {
              hours = "0" + dateMsg.getHours().toString();
            } else {
              hours = dateMsg.getHours().toString();
            }
            if (dateMsg.getMinutes().toString().length == 1) {
              minutes = "0" + dateMsg.getMinutes().toString();
            } else {
              minutes = dateMsg.getMinutes().toString();
            }
            users[i].lastMessage.date = hours + ":" + minutes;
          }
          this.chatListUsers.push(users[i]);
        }
      },
        err => { console.log(err) },
        () => {
          this.sortChatList();
          this.historyUsers = this.chatListUsers.slice();
        });
  }

  sortChatList() {
    this.chatListUsers.sort(function (a, b) {
      if (a.lastMessage.date.includes("-") && b.lastMessage.date.includes("-")) {
        let a_day = Number(a.lastMessage.date.split("-")[0]);
        let b_day = Number(b.lastMessage.date.split("-")[0]);
        let a_month = Number(a.lastMessage.date.split("-")[1]);
        let b_month = Number(b.lastMessage.date.split("-")[1]);
        let a_year = Number(a.lastMessage.date.split("-")[2]);
        let b_year = Number(b.lastMessage.date.split("-")[2]);
        return a_year < b_year ? -1 : a_year > b_year ? 1 : a_month < b_month ? -1 : a_month > b_month ? 1 : a_day < b_day ? -1 : a_day > b_day ? 1 : 0;
      } else if (a.lastMessage.date.includes(":") && b.lastMessage.date.includes(":")) {
        let a_hours = Number(a.lastMessage.date.split(":")[0]);
        let b_hours = Number(b.lastMessage.date.split(":")[0]);
        let a_minutes = Number(a.lastMessage.date.split(":")[1]);
        let b_minutes = Number(b.lastMessage.date.split(":")[1]);
        return a_hours < b_hours ? 1 : a_hours > b_hours ? -1 : a_minutes < b_minutes ? 1 : a_minutes > b_minutes ? -1 : 0;
      }
      else if (a.lastMessage.date.includes(":") && b.lastMessage.date.includes("-")) {

        return -1;
      } else {
        return 1
      }


    });

  }

  listenForAllMessages(userId: string): void {
    this.userId = userId;
    this.s = this.db.object('notifications/' + this.userId + '/messaging');
    var item = this.s.valueChanges()
    this.s.snapshotChanges().subscribe(action => {
      var notif = action.payload.val();
      if (notif !== null && !this.msgFirstCheck) {
        this.chatService.getMessage(notif.msgId).subscribe(
          message => {

            var elementPos = this.historyUsers.map(function (x) { return x.lastMessage.fromUserId; }).indexOf(notif.senderId);
            if (this.historyUsers[elementPos] == undefined) {
              elementPos = this.historyUsers.map(function (x) { return x.lastMessage.toUserId; }).indexOf(notif.senderId);
            }
            this.historyUsers[elementPos].lastMessage.message = message.message;

            let actualDate = new Date(Date.now());
            let hours = actualDate.getHours().toString();
            let minutes = actualDate.getMinutes().toString();

            if (hours.length == 1) {
              hours = "0" + hours;
            }
            if (minutes.length == 1) {
              minutes = "0" + minutes;
            }

            this.historyUsers[elementPos].lastMessage.date = hours + ":" + minutes;
            this.chatListUsers = this.historyUsers.slice();


          },
          err => console.log('Could send message to server, reason: ', err)
        );
      } else {
        this.msgFirstCheck = false;
      }
    });
  }


  getSuggestionsList() {
    /*
     les abonnées dont il n'a pas fait des conversations avec encore
     */
    this.chatService.getSuggestions(this.userId)
      .map(users => {
        return users.json();
      })
      .subscribe((users: any[]) => {
        console.log(users)
        for (let i = 0; i < users.length; i++) {
          this.suggestions.push(users[i]);
        }

      })
  }

  reactToNewMessages() {
    this.chatService.messageEmitter.subscribe(message => {
      let profiles = this.historyUsers.filter(user => user._id == message.fromUserId);
      if (profiles[0]) {
        let index = this.historyUsers.findIndex(user => user._id == message.fromUserId);
        this.historyUsers.splice(index, 1);
        profiles[0].lastMessage.message = message.message;
        let actualDate = new Date(Date.now());
        let hours = actualDate.getHours().toString();
        let minutes = actualDate.getMinutes().toString();

        if (hours.length == 1) {
          hours = "0" + hours;
        }
        if (minutes.length == 1) {
          minutes = "0" + minutes;
        }

        profiles[0].lastMessage.date = hours + ":" + minutes;
        this.historyUsers.unshift(profiles[0]);
        this.notread = true;
        this.changeDetector.markForCheck();
        console.log(profiles[0])
      } else {
        profiles = this.suggestions.filter(user => user._id == message.fromUserId);
        if (profiles[0]) {
          profiles[0].lastMessage = message;
          this.historyUsers.unshift(profiles[0]);
          this.notread = true;
          this.changeDetector.markForCheck();
          console.log(profiles[0])
        }  else {
            this.http.get(
              environment.SERVER_URL + pathUtils.GET_PROFILE + message.fromUserId,
              AppSettings.OPTIONS)
              .map((res: Response) => res.json())
              .subscribe(
                response => {
                  if (response.status == "0") {
                    let profile = {
                      _id: response.user._id,
                      firstName: response.user.firstName,
                      lastName: response.user.lastName,
                      profilePicture: response.user.profilePicture,
                      lastMessage: message
                    }
                    this.historyUsers.unshift(profile);
                    this.notread = true;
                    console.log(profile)
                  }

                },
                err => {
                },
                () => {
                  this.changeDetector.markForCheck();
                }
              );
          }
        }
        console.log(message)
      
      this.chatListUsers=this.historyUsers.slice()
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
    var found = this.historyUsers.some(function (profile) {
      return profile._id == user._id;
    });
    if (!found) this.historyUsers.unshift(user)

    this.selectUser(user)
    if(user.lastMessage){
      user.lastMessage.isSeen = true;
    }
    this.searchValue = ""
    this.chatListUsers = this.historyUsers.slice();
    this.updateMyMessages();
  }

  filterChatListUsersByName(name) {
    return this.historyUsers.filter((user) => {
      let fullName = user.firstName + ' ' + user.lastName;
      return fullName.includes(name);
    });
  }

  filterSubscriptionsByName(name) {
    if (this.user.subscriptionsDetails) {

      return this.user.subscriptionsDetails.filter((user) => {
        let fullName = user.firstName + ' ' + user.lastName;
        return fullName.includes(name);
      });
    }

  }

  onFocus() {
    if (this.searchBar.nativeElement.value.length >= 1) {
      this.searchBar.nativeElement.style.display = "block!important";
      this.onChange(this.searchBar.nativeElement.value);
    }
  }


  onChange(newValue: string) {
    this.chatListUsers = [];
    this.changeDetector.markForCheck();
    if (newValue.length >= 1) {


      let searchInHistory = this.filterChatListUsersByName(newValue);
      if (searchInHistory && searchInHistory.length > 0) {

        this.chatListUsers = searchInHistory
      } else {

        let searchInSubscriptions = this.filterSubscriptionsByName(newValue);

        if (searchInSubscriptions && searchInSubscriptions.length > 0) {
          this.chatListUsers = searchInSubscriptions;
        } else {

          this.getListSearchUsers(newValue);
        }
      }
    } else {
      this.chatListUsers = this.historyUsers.slice();
    }
    this.changeDetector.markForCheck();
  }



  getListSearchUsers(key: string) {
    this.http
      .get(
        environment.SERVER_URL + pathUtils.FIND_PROFILE + key,
        AppSettings.OPTIONS
      )
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          if (response.status == 0) {
            if (response.profiles)
              for (var i = 0; i < response.profiles.length; i++) {
                this.chatListUsers[i] = response.profiles[i];
                this.changeDetector.markForCheck();
              }
          }
        },
        err => {
          this.noSearchResults = true;
        },
        () => {
          if (this.chatListUsers.length == 0) {
            this.noSearchResults = true;
          } else {
            this.noSearchResults = false;
          }
          this.changeDetector.markForCheck();
        }
      );
  }

  onClickOutside() {
    this.searchValue = "";
    this.chatListUsers = this.historyUsers.slice();
  }



}
