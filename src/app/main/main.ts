import { Component, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/map';

/* Main components */
import { Home } from './home/home';
import { Parameters } from './parameters/parameters';
import { Profile } from './profile/profile';
import { Notification } from './notification/notification';

/* services */
import { LoginService } from '../service/loginService';

/* user  */
import { User } from '../beans/user';
import { AppSettings } from "../conf/app-settings";
import { Response, Http } from "@angular/http";
import { Post } from "./post/post";
import { NotificationBean } from "../beans/notification-bean";
import { Title } from "@angular/platform-browser";
import { RecentRechService } from "../service/recentRechService";
import { DateService } from "../service/dateService";
import {environment} from "../../environments/environment";

declare var jQuery: any;
declare var FB: any;
declare var auth: any;
declare const gapi: any;

@Component({
    moduleId: module.id,
    selector: 'main',
    templateUrl: 'main.html'
})

export class Main {
    //Variables declaration
    autocomplete = false;
    notification = false;
    signoutHover = false;
    amHome = false;
    user: User = new User();
    listSearshUsers: Array<User> = [];
    listNotif: Array<NotificationBean>;
    nbNoSeenNotif: number;
    searchValue: string;
    showRecentSearch: Boolean;
    RecentSearchList;
    nbNotificationsNotSeen;
    lastNotifId = "";
    showButtonMoreNotif: Boolean = false;
    showNoNotif: Boolean = false;

    constructor(private dateService: DateService, private http: Http, private location: Location, private router: Router,
                private loginService: LoginService, private changeDetector: ChangeDetectorRef, private recentRechService: RecentRechService) {
        this.listNotif = [];
        if (!this.recentRechService.isEmptyList())
            this.RecentSearchList = this.recentRechService.getListRecentRech();
        this.showButtonMoreNotif = false;
        this.listNotif = [];
        this.user = this.loginService.getUser();
        this.loadNotif();
    }

    loadNotif() {
        if (this.user) {
            if (this.user._id) {
                setInterval(() => {
                    this.http.get(environment.SERVER_URL + 'getNbNotificationsNotSeen?profileId=' + this.user._id, AppSettings.OPTIONS)
                        .map((res: Response) => res.json())
                        .subscribe(
                        response => {
                            if (!response.status) {
                                if (response.nbNotificationsNotSeen > this.nbNoSeenNotif) {
                                    var snd = new Audio('./assets/music/notification.mp3');
                                    snd.play();
                                }
                                this.nbNoSeenNotif = response.nbNotificationsNotSeen;
                            }
                        },
                        err => {
                        },
                        () => {
                            this.changeDetector.markForCheck();
                        }
                        );
                }, 5000);
            }
        }
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
        this.router.navigate(['/main/profile', _id]);
    }

    onChange(newValue: string) {
        this.listSearshUsers = [];
        this.enableAutocomplete();
        this.changeDetector.markForCheck();
        if (newValue.length > 1) {
            this.getListSearchUsers(newValue);
        }
        else {
            if (this.recentRechService.isEmptyList()) {
                this.disableAutocomplete();
            }
            else {
                this.showRecentSearchUsers();
            }
        }
        this.changeDetector.markForCheck();
    }

    showRecentSearchUsers() {
        if (this.recentRechService.isEmptyList()) {
            this.disableAutocomplete();
            this.showRecentSearch = false;
        }
        else {
            this.enableAutocomplete();
            this.RecentSearchList = this.recentRechService.getListRecentRech();
            this.showRecentSearch = true;
        }
        this.changeDetector.markForCheck();
    }
    goHome() {
        this.router.navigate(['/main/home']);
    }

    getListSearchUsers(key: string) {
        this.showRecentSearch = false;
        this.http.get(environment.SERVER_URL + 'findProfile?ProfileName=' + key, AppSettings.OPTIONS)
            .map((res: Response) => res.json())
            .subscribe(
            response => {
                this.listSearshUsers = [];
                this.changeDetector.markForCheck();
                for (var i = 0; i < this.listSearshUsers.length; i++) {
                    this.listSearshUsers.pop();
                    this.changeDetector.markForCheck();
                }
                if (response.status == 1) {
                    if (response.profiles)
                        for (var i = 0; i < response.profiles.length; i++) {
                            this.listSearshUsers[i] = response.profiles[i];
                            this.changeDetector.markForCheck();
                        }
                }

            },
            err => {
            },
            () => {
                if (this.listSearshUsers.length == 0) {
                    this.disableAutocomplete();
                }
                this.changeDetector.markForCheck();
            }
            );

    }
    checkAutoComplete() {
        if (this.searchValue && this.searchValue.length > 1) {
            this.getListSearchUsers(this.searchValue);
        }
        else {
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
        jQuery(".recherche-results-holder").hide();
        jQuery(".upper-arrow-search").hide();
    }
    showFirstNotif() {
        this.loadFirstNotifactions();
        this.enableNotification();
    }
    enableNotification() {
        jQuery(".notification-holder").toggle();
        jQuery(".upper-arrow-notification").toggle();
    }
    enableProfile() {
        jQuery(".profile-hover").toggle();
        jQuery(".upper-arrow-profile").toggle();
    }
    ngOnInit() {
        if (this.location.path() == "/main/home") {
            this.amHome = true;
        }
        else {
            this.amHome = false;
        }
        jQuery((".recherche-results-holder")).blur(function () {
            jQuery((".file-input-holder")).hide();

        });
        setInterval(() => {
            this.changeDetector.markForCheck();
        }, 500);
        jQuery(document).click(function (e) {

            // check that your clicked
            // element has no id=info

            if (jQuery(e.target).closest(".recherche-results-holder").length === 0 && jQuery(e.target).closest(".header-center").length === 0) {
                jQuery(".recherche-results-holder").hide();
                jQuery(".upper-arrow-search").hide();
            }

            if (jQuery(e.target).closest(".notification-holder").length === 0 && jQuery(e.target).closest(".notification-parent").length === 0) {
                jQuery(".notification-holder").hide();
                jQuery(".upper-arrow-notification").hide();
            }
            if (jQuery(e.target).closest(".fa-sort-desc").length === 0) {
                jQuery(".profile-hover").hide();
                jQuery(".upper-arrow-profile").hide();
            }


        });

    }
    loadFirstNotifactions() {
        this.lastNotifId = "";
        this.showButtonMoreNotif = false;
        this.showNoNotif = false;
        if (this.user) {
            this.http.get(environment.SERVER_URL + 'getNotifications?profileId=' + this.user._id + '&lastNotificationId=', AppSettings.OPTIONS)
                .map((res: Response) => res.json())
                .subscribe(
                response => {
                    if (response.length) {
                        this.showNoNotif = false;
                        this.listNotif = response;
                        this.lastNotifId = response[response.length - 1]._id;
                        this.http.get(environment.SERVER_URL + 'getNotifications?profileId=' + this.user._id + '&lastNotificationId=' + this.lastNotifId, AppSettings.OPTIONS)
                            .map((res: Response) => res.json())
                            .subscribe(
                            response => {
                                if (response.length == 0) {
                                    this.showButtonMoreNotif = false;
                                }
                                else {
                                    this.showButtonMoreNotif = true;
                                }
                            },
                            err => {
                            },
                            () => {
                                this.changeDetector.markForCheck();
                            }
                            );
                    }
                    else {
                        this.listNotif = [];
                        this.showNoNotif = true;
                        this.showButtonMoreNotif = false;
                    }
                },
                err => {
                },
                () => {
                    this.changeDetector.markForCheck();
                }
                );
            this.changeDetector.markForCheck();
        }
    }
    loadMoreNotif() {
        if (this.user) {
            jQuery(".notification-holder").show();
            jQuery(".upper-arrow-notification").show();
            this.http.get(environment.SERVER_URL + 'getNotifications?profileId=' + this.user._id + '&lastNotificationId=' + this.lastNotifId, AppSettings.OPTIONS)
                .map((res: Response) => res.json())
                .subscribe(
                response => {
                    if (response.length != 0) {
                        for (var i = 0; i < response.length; i++) {
                            this.listNotif.push(response[i]);
                            this.lastNotifId = response[i]._id;
                        }
                        this.http.get(environment.SERVER_URL + 'getNotifications?profileId=' + this.user._id + '&lastNotificationId=' + this.lastNotifId, AppSettings.OPTIONS)
                            .map((res: Response) => res.json())
                            .subscribe(
                            response => {
                                if (response.length == 0) {
                                    this.showButtonMoreNotif = false;
                                }
                                else {
                                    this.showButtonMoreNotif = true;
                                }
                            },
                            err => {
                            },
                            () => {
                                this.changeDetector.markForCheck();
                            }
                            );
                    }
                    else {
                        this.showButtonMoreNotif = false;
                    }
                },
                err => {
                },
                () => {
                    this.changeDetector.markForCheck();
                }
                );
            this.changeDetector.markForCheck();
            jQuery(".notification-holder").show();
            jQuery(".upper-arrow-notification").show();
        }
    }

    getNotificationTime(publishDateString: string): string {

        let date = new Date();
        let currentDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
        let publishDate = this.dateService.convertIsoToDate(publishDateString);
        var displayedDate = "";

        let diffDate = this.dateService.getdiffDate(publishDate, currentDate);
        if (diffDate.day > 28) {
            displayedDate = this.dateService.convertPublishDate(publishDate);
        }
        else if (diffDate.day && diffDate.day == 1) {
            displayedDate = "hier";
        }
        else if (diffDate.day > 0) {
            displayedDate = diffDate.day + " jours";
        }
        else if ((diffDate.hour) && (diffDate.hour == 1)) {
            displayedDate = "1 h";
        }
        else if ((diffDate.hour) && (diffDate.hour > 0)) {
            displayedDate = diffDate.hour + " hrs";
        }
        else if ((diffDate.min) && (diffDate.min > 1))
            displayedDate = diffDate.min + " mins";
        else
            displayedDate = "maintenant";
        return displayedDate;
    }
    goTo(source, parm, notifId) {
        let body = JSON.stringify({
            notificationId: notifId
        });
        this.http.post(environment.SERVER_URL + 'setNotificationSeen ', body, AppSettings.OPTIONS)
            .map((res: Response) => res.json())
            .subscribe(
            response => {
            },
            err => { },
            () => { });
        this.router.navigate(["/main/" + source, parm]);

    }
}




