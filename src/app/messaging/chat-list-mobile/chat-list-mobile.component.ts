import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../beans/user';
import { LoginService } from '../../login/services/loginService';
import { ChatService } from '../../messanging/chat.service';
import { AppSettings } from '../../shared/conf/app-settings';
import * as pathUtils from '../../utils/path.utils';
import { EmitterService } from '../emitter.service';
import { AngularFireObject, AngularFireDatabase } from '../../../../node_modules/angularfire2/database';

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
  private notread: boolean;
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
  loaded: Boolean = false;
  @ViewChild("searchBar") searchBar: ElementRef;

  //
  constructor(
    public translate: TranslateService,
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
    this.getChatList();
    this.getSuggestionsList();
    //this.listenForAllMessages(this.userId);
    this.reactToNewMessages();
  }
  translateCode(code) {
    let message;
    this.translate.get(code).subscribe((resTranslate: string) => {
      message = resTranslate;
    });
    return message;
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
          let day_text = day.toString();
          if (day_text.length == 1) {
            day_text = "0" + day_text;
          }
          let month_text = '';
          if ((actualDate.getFullYear() - year > 0) ||
            ((actualDate.getMonth() + 1) - month > 0) ||
            (actualDate.getDate() - day > 0)) {
            switch (month) {
              case 1:
                month_text = this.translateCode("January");
                break;
              case 2:
                month_text = this.translateCode("February");
                break;
              case 3:
                month_text = this.translateCode("March");
                break;
              case 4:
                month_text = this.translateCode("April");
                break;
              case 5:
                month_text = this.translateCode("May");
                break;
              case 6:
                month_text = this.translateCode("June");
                break;
              case 7:
                month_text = this.translateCode("July");
                break;
              case 8:
                month_text = this.translateCode("August");
                break;
              case 9:
                month_text = this.translateCode("September");
                break;
              case 10:
                month_text = this.translateCode("October");
                break;
              case 11:
                month_text = this.translateCode("November");
                break;
              case 12:
                month_text = this.translateCode("December");
                break;
            }
            users[i].lastMessage.date = day_text + " " + month_text + " " + year;
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
          this.loaded = true;
          this.sortChatList();
          this.historyUsers = this.chatListUsers.slice();
        });
  }

  sortChatList() {
    this.chatListUsers.sort(function (a, b) {
      if (a.lastMessage.date > b.lastMessage.date) return 1;
      if (a.lastMessage.date < b.lastMessage.date) return -1;
      return 0;
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

            var elementPos = this.chatListUsers.map(function (x) { return x.lastMessage.fromUserId; }).indexOf(notif.senderId);
            if (this.chatListUsers[elementPos] == undefined) {
              elementPos = this.chatListUsers.map(function (x) { return x.lastMessage.toUserId; }).indexOf(notif.senderId);
            }
            this.chatListUsers[elementPos].lastMessage.message = message.message;

            let actualDate = new Date(Date.now());
            let hours = actualDate.getHours().toString();
            let minutes = actualDate.getMinutes().toString();

            if (hours.length == 1) {
              hours = "0" + hours;
            }
            if (minutes.length == 1) {
              minutes = "0" + minutes;
            }

            this.chatListUsers[elementPos].lastMessage.date = hours + ":" + minutes;
            //console.log(hours + ":" + minutes);

          },
          err => console.log('Could send message to server, reason: ', err)
        );
      } else {
        this.msgFirstCheck = false;
      }
    });
  }

  reactToNewMessages() {
    this.chatService.messageEmitter.subscribe(message => {
      let profiles = this.historyUsers.filter(user => user._id === message.fromUserId);
      if (profiles[0]) {
        let index = this.historyUsers.findIndex(user => user._id === message.fromUserId);
        this.historyUsers.splice(index, 1);
        profiles[0].lastMessage.message = message.message;
        profiles[0].lastMessage.date = this.getCurrentDate();
        this.historyUsers.unshift(profiles[0]);
        this.chatListUsers = this.historyUsers.slice()
        this.notread = true;
        this.changeDetector.markForCheck();
      } else {
        let profiles = this.suggestions.filter(user => user._id === message.fromUserId);
        if (profiles[0]) {
          profiles[0].lastMessage = message;
          
          profiles[0].lastMessage.date = this.getCurrentDate();
          this.historyUsers.unshift(profiles[0]);
          this.chatListUsers = this.historyUsers.slice()
          this.notread = true;
          this.changeDetector.markForCheck();
        } else {
          this.http.get(
            environment.SERVER_URL + pathUtils.GET_PROFILE + message.fromUserId,
            AppSettings.OPTIONS)
            .map((res: Response) => res.json())
            .subscribe(
              response => {
                if (response.status == "0") {
                
                  let newProfile = {
                    _id: response.user._id,
                    firstName: response.user.firstName,
                    lastName: response.user.lastName,
                    profilePicture: response.user.profilePicture,
                    lastMessage: {
                      ...message,
                      date: this.getCurrentDate()
                    }
                  }
                  this.historyUsers.unshift(newProfile);
                  this.chatListUsers = this.historyUsers.slice()
                  this.notread = true;
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
    })
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
        for (let i = 0; i < users.length; i++) {
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
    /* Sending selected users information to other component. */
    this.emitterService.emitUser(user);
    this.router.navigate(['/main/mobile/' + user._id]);
  }

  /*Search functionnality*/
  loadUser(user) {
    var found = this.historyUsers.some(function (profile) {
      return profile._id == user._id;
    });
    if (!found) this.historyUsers.unshift(user)

    this.selectUser(user)
    if (user.lastMessage) {
      user.lastMessage.isSeen = true;
    }
    this.searchValue = ""
    this.chatListUsers = this.historyUsers.slice();
    //this.updateMyMessages();
  }

  filterChatListUsersByName(name) {
    return this.historyUsers.filter((user) => {
      let fullName = user.firstName + ' ' + user.lastName;
      return fullName.includes(name);
    });
  }

  filterSubscriptionsByName(name) {
    return this.user.subscriptions.filter((user) => {
      let fullName = user.firstName + ' ' + user.lastName;
      return fullName.includes(name);
    });
  }

  onFocus() {
    this.searchBar.nativeElement.style.display = "block!important";
    this.onChange(this.searchBar.nativeElement.value);
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


  enableAutocomplete() {
    jQuery(".recherche-results-holder").show();
    jQuery(".upper-arrow-search").show();
    this.changeDetector.markForCheck();
  }

  disableAutocomplete() {
    jQuery(".recherche-results-holder-1").hide();
    jQuery(".upper-arrow-search").hide();
  }
  getCurrentDate(){
    let actualDate = new Date(Date.now());
    let hours = actualDate.getHours().toString();
    let minutes = actualDate.getMinutes().toString();
    //console.log(actualDate);
    if (hours.length == 1) {
      hours = "0" + hours;
    }
    if (minutes.length == 1) {
      minutes = "0" + minutes;
    }
   return hours + ":" + minutes
  }
}
