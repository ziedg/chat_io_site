import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { TranslateService } from "@ngx-translate/core";
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
    this.getLoggedInUser(this.userId)
    this.getChatList();
    this.getSuggestionsList();
    this.reactToNewMessages();
    //this.listenForAllMessages(this.userId);
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

  updateLastMessage() {
    this.emitterService.lastMessageEmitter.subscribe((msg) => {
      if (msg.fromUserId === this.userId) {
        let elementPos = this.historyUsers.map(function (x) { return x._id }).indexOf(msg.toUserId);
        let profile = this.historyUsers[elementPos];
        this.historyUsers.splice(elementPos, 1);

        profile['lastMessage'] = JSON.parse(JSON.stringify(msg));
        profile.lastMessage.message = this.translateCode("you : ") + msg.message;

        profile.lastMessage.date = this.getCurrentDate();
        profile.lastMessage.isSeen = false;
        this.historyUsers.unshift(profile);
        this.chatListUsers = this.historyUsers.slice()
      } else {
        let elementPos = this.historyUsers.map(function (user) { return user._id }).indexOf(msg.fromUserId)
        let profile = this.historyUsers[elementPos];
        this.historyUsers.splice(elementPos, 1);

        profile['lastMessage'] = JSON.parse(JSON.stringify(msg));
        profile.lastMessage.date = this.getCurrentDate();
        profile.lastMessage.isSeen = false;
        this.historyUsers.unshift(profile);
        this.chatListUsers = this.historyUsers.slice()
      }

    })
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
        let result = users.json().sort(function (a, b) {
          if (new Date(a.lastMessage.date) > new Date(b.lastMessage.date)) return -1;
          if (new Date(a.lastMessage.date) < new Date(b.lastMessage.date)) return 1;
          return 0;
        });
        return result;
      })
      .subscribe((users: any[]) => {
        for (let i = 0; i < users.length; i++) {
          if (users[i].lastMessage.fromUserId == this.userId) {
            users[i].lastMessage.message = this.translateCode("you : ") + users[i].lastMessage.message;
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
          if (actualDate.getFullYear() - year == 0) {
            if ((actualDate.getMonth() + 1) - month == 0) {
              if ((actualDate.getDate() - day) == 0) {
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
              }else if ((actualDate.getDate() - day) == 1){
                users[i].lastMessage.date = this.translateCode('prefix_date_yesterday');
              } else {
                users[i].lastMessage.date = day_text + " " + month_text;
              }
            } else {
              users[i].lastMessage.date = day_text + " " + month_text;
            }
          } else {
            users[i].lastMessage.date = day_text + " " + month_text + " " + year;
          }
          this.chatListUsers.push(users[i]);
        }
      },
        err => { //console.log(err) },
        () => {
          this.historyUsers = this.chatListUsers.slice();
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
        for (let i = 0; i < users.length; i++) {
          this.suggestions.push(users[i]);
        }

      })
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
          profiles[0]['lastMessage'] = JSON.parse(JSON.stringify(message));
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
                  let newUser = {
                    _id: response.user._id,
                    firstName: response.user.firstName,
                    lastName: response.user.lastName,
                    profilePicture: response.user.profilePicture,
                    lastMessage: {
                      ...message,
                      date: this.getCurrentDate()
                    }
                  }
                  this.historyUsers.unshift(newUser);
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
    if (user.lastMessage && this.user._id != user._id) {
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

  onClickOutside() {
    this.searchValue = "";
    this.chatListUsers = this.historyUsers.slice();
  }

  sameUser(userId: string) {
    return userId == this.userId ? true : false;
  }

  getCurrentDate() {
    let actualDate = new Date(Date.now());
    let hours = actualDate.getHours().toString();
    let minutes = actualDate.getMinutes().toString();
    if (hours.length == 1) {
      hours = "0" + hours;
    }
    if (minutes.length == 1) {
      minutes = "0" + minutes;
    }
    return hours + ":" + minutes
  }
}
