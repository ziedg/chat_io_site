import 'rxjs/add/operator/map';

import { Location } from '@angular/common';
import {
  ApplicationRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { environment } from '../../../environments/environment';
import { NotificationBean } from '../../beans/notification-bean';
import { User } from '../../beans/user';
import { LoginService } from '../../login/services/loginService';
import { AppSettings } from '../../shared/conf/app-settings';
import { urlB64ToUint8Array, VAPID_PUBLIC_KEY } from '../../utils/notification';
import * as pathUtils from '../../utils/path.utils';
import { DateService } from '../services/dateService';
import { NotificationService } from '../services/notification.service';
import { RecentRechService } from '../services/recentRechService';

//Notification
declare var jQuery: any;
declare var FB: any;
declare var auth: any;
declare const gapi: any;

@Component({
  moduleId: module.id,
  selector: "main",
  templateUrl: "main.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Main {
  showSearchMobile: boolean;
  autocomplete = false;
  notification = false;
  signoutHover = false;
  user: User = new User();
  listSearchUsers: Array<User> = [];
  listNotif: Array<NotificationBean> = [];
  nbNewNotifications: number = 0;
  searchValue: string;
  showRecentSearch: Boolean;
  RecentSearchList;
  lastNotifId = "";
  showButtonMoreNotif: Boolean = false;
  showNoNotif: Boolean = false;
  noSearchResults: Boolean = false;
  public showNotif:boolean=true;

  icons;

  @ViewChild("searchResults2") searchRes2: ElementRef;
  @ViewChild("searchMobileInput") searchInput: ElementRef;

  // Notification vars
  private subscriptionJson = '';
  private isSubscribed = false;
  private registration = undefined;
  // end Notification vars


  constructor(
    public translate: TranslateService,
    private dateService: DateService,
    private http: Http,
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private changeDetector: ChangeDetectorRef,
    private recentRechService: RecentRechService,
    private appRef: ApplicationRef,
    private meta: Meta,
    private elementRef: ElementRef,
    private renderer: Renderer2,


    //Notiifcation
    private notificationService: NotificationService) {
    if (!this.recentRechService.isEmptyList())
      this.RecentSearchList = this.recentRechService.getListRecentRech();
    this.showButtonMoreNotif = false;
    this.listNotif = [];

    this.icons = {
      messaging: {
        icon: "messaging-icon",
        type: "outline"
      },
      home: {
        icon: "home-icon",
        type: "outline"
      },
      search: {
        icon: "search-icon",
        type: "outline"
      },
      notifications: {
        icon: "notifications-icon",
        type: "outline"
      },
      profile: {
        icon: "user-icon",
        type: "outline"
      },
      outline: "outline",
      full: "full",
      activeIcon: "home",
      wasActiveIcon: ""
    };
  }


  ngOnInit() {

//for touati: i was just listening for the socket events for notifications here in the main component because he is the parent of the the others


    // meta tag to fix view on iDevices (like iPohne)
    this.meta.addTag({
      name: "viewport",
      content: "width=device-width, initial-scale=1.0"
    });
    this.checkNewNotifications();

    jQuery(".recherche-results-holder").blur(function() {
      jQuery(".file-input-holder").hide();
    });
    setInterval(() => {
      this.changeDetector.markForCheck();
    }, 500);

    jQuery(document).click(function(e) {
      if (
        jQuery(e.target).closest(".recherche-results-holder").length === 0 &&
        jQuery(e.target).closest(".header-center").length === 0
      ) {
        jQuery(".recherche-results-holder").hide();
        jQuery(".upper-arrow-search").hide();
      }
      if (
        jQuery(e.target).closest(".notification-holder").length === 0 &&
        jQuery(e.target).closest(".notification-parent").length === 0
      ) {
        jQuery(".notification-holder").hide();
        jQuery(".upper-arrow-notification").hide();
      }
      if (jQuery(e.target).closest(".fa-sort-desc").length === 0) {
        jQuery(".profile-hover").hide();
        jQuery(".upper-arrow-profile").hide();
      }
    });


  }


  saveRecentRech(_id, firstName, lastName, profilePicture, profilePictureMin) {
    let newRechUser = {};
    newRechUser = JSON.stringify({
      _id: _id,
      firstName: firstName,
      lastName: lastName,

      profilePicture: profilePicture,
      profilePictureMin: profilePictureMin
    });
    this.recentRechService.addToListRecentRech(JSON.parse(<string>newRechUser));
    this.changeDetector.markForCheck();
    this.disableAutocomplete();
    this.RecentSearchList = this.recentRechService.getListRecentRech();
    this.router.navigate(["/main/profile", _id]);
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
      .map((res: Response) => res.json())
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

  enableProfile() {
    jQuery(".profile-hover").toggle();
    jQuery(".upper-arrow-profile").toggle();
  }

  hideMenuProfile() {
    jQuery(".profile-hover").hide();
    jQuery(".upper-arrow-profile").hide();
  }

  loadFirstNotifactions() {
    this.lastNotifId = "";
    this.listNotif = [];
    this.getNotifications();
  }


  getNotifications() {
    this.http
      .get(
        environment.SERVER_URL + pathUtils.GET_NOTIFICATIONS + this.lastNotifId,
        AppSettings.OPTIONS
      )
      .map((res: Response) => res.json())
      .subscribe(
        response => {

          if (response.length != 0) {
            this.showNoNotif = false;
            let arr = this.listNotif;
            for (var i = 0; i < response.length; i++) {
              //uniqness test before push

              arr.push(response[i]);

              this.lastNotifId = response[i]._id;

            }

            arr = _.uniqWith(this.listNotif, _.isEqual);
            arr = _.uniqBy(this.listNotif, notif => {
              return notif._id;
            });

             this.listNotif = arr;

            if (response.length == 5) this.showButtonMoreNotif = true;
            else this.showButtonMoreNotif = false;
          } else {
            this.showNoNotif = true;
            this.showButtonMoreNotif = false;
          }
        },
        err => {},
        () => {
          this.nbNewNotifications = 0;
          this.showNotificationList();
          this.changeDetector.markForCheck();
        }
      );
  }

  getNotificationTime(publishDateString: string): string {
    let date = new Date();
    let currentDate = new Date(
      date.valueOf() + date.getTimezoneOffset() * 60000
    );
    let publishDate = this.dateService.convertIsoToDate(publishDateString);
    var displayedDate = "";

    let diffDate = this.dateService.getdiffDate(publishDate, currentDate);
    if (diffDate.day > 28) {
      displayedDate = this.dateService.convertPublishDate(publishDate);
    } else if (diffDate.day && diffDate.day == 1) {
      displayedDate = this.translateCode("prefix_date_yesterday");
    } else if (diffDate.day > 0) {
      displayedDate = diffDate.day + this.translateCode("prefix_date_days");
    } else if (diffDate.hour && diffDate.hour == 1) {
      displayedDate = this.translateCode("prefix_date_one_hour");
    } else if (diffDate.hour && diffDate.hour > 0) {
      displayedDate = diffDate.hour + this.translateCode("prefix_date_hours");
    } else if (diffDate.min && diffDate.min > 1)
      displayedDate = diffDate.min + this.translateCode("prefix_date_minutes");
    else displayedDate = this.translateCode("prefix_date_now");
    return displayedDate;
  }

  goTo(source, parm, notifId) {
    this.markView(notifId);
    this.hideNotificationList();
    this.router.navigate(["/main/" + source, parm]);
  }

  markView(notifId) {
    let body = JSON.stringify({
      notificationId: notifId
    });
    this.http
      .post(
        environment.SERVER_URL + pathUtils.MARK_VIEW,
        body,
        AppSettings.OPTIONS
      )
      .map((res: Response) => res.json())
      .subscribe(response => {}, err => {}, () => {});
  }

  checkNewNotifications() {
    this.http
      .get(
        environment.SERVER_URL + pathUtils.CHECK_NEW_NOTIFICATIONS,
        AppSettings.OPTIONS
      )
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          if (response.status == 0) {
            this.nbNewNotifications = response.nbNewNotifications;
          }
        },
        err => {},
        () => {
          this.changeDetector.markForCheck();
        }
      );
  }

  loadNotif() {
    setInterval(() => {
      this.checkNewNotifications();
    }, 5000);
  }

  showNotificationList() {
    jQuery(".notification-holder").show();
    jQuery(".upper-arrow-notification").show();
  }

  hideNotificationList() {
    jQuery(".notification-holder").hide();
    jQuery(".upper-arrow-notification").hide();
  }

  translateCode(code) {
    let message;
    this.translate.get(code).subscribe((resTranslate: string) => {
      message = resTranslate;
    });
    return message;
  }

  clearSearchMobile() {
    this.searchInput.nativeElement.value = "";
    this.listSearchUsers.length = 0;
    this.noSearchResults = false;
  }


  // Notification !!

  private init() {
    this.registration.pushManager.getSubscription().then(subscription => {
      this.isSubscribed = !(subscription === null);
      this.updateSubscriptionOnServer(subscription);
      console.log(`User ${this.isSubscribed ? 'IS' : 'is NOT'} subscribed.`);
      if (!this.isSubscribed){
        this.subscribeUser()
      }
    });
  }

  subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(VAPID_PUBLIC_KEY);
    this.registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      })
      .then(subscription => {
        console.log('User is subscribed.');
        this.updateSubscriptionOnServer(subscription);
        this.isSubscribed = true;
      })
      .catch(err => {
        console.log('Failed to subscribe the user: ', err);
      });
  }

  private updateSubscriptionOnServer(subscription) {
    if (subscription) {
      this.subscriptionJson = subscription;
      this.notificationService.addPushSubscriber(subscription).subscribe(
        () => console.log('Sent push subscription object to server.'),
        err =>  console.log('Could not send subscription object to server, reason: ', err));
    } else {
      this.subscriptionJson = '';
    }
  }

}
