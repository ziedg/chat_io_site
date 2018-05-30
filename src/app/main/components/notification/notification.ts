import { OnInit } from '@angular/core';
import {Component, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

/* conf */
import {AppSettings} from '../../../shared/conf/app-settings';
import {TranslateService} from '@ngx-translate/core';

/* services */
import {LoginService} from '../../../login/services/loginService';
import {DateService} from "../../services/dateService";
import {NotificationBean} from "../../../beans/notification-bean";
import {User} from "../../../beans/user";
import {environment} from "../../../../environments/environment";

/** Utils */
import * as pathUtils from '../../../utils/path.utils';

@Component({
    selector: 'notification',
    templateUrl: 'notification.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})


export class Notification implements OnInit {
    lastNotifId="";
    showButtonMoreNotif:Boolean=false;
    showNoNotif:Boolean=false;
    listNotif : Array <NotificationBean> = [];
    user:User = new User();
    noMoreNotif:Boolean=false;

    constructor(public translate:TranslateService,
                private dateService:DateService,
                private http:Http,
                private router:Router,
                private loginService:LoginService,
                private changeDetector: ChangeDetectorRef) {
        this.listNotif=[];

      this.loginService.redirect();
      this.user = this.loginService.getUser();

        this.loadFirstNotifactions();
    }

  loadFirstNotifactions() {
    this.lastNotifId = "";
    this.listNotif = [];
    this.getNotifications();
  }


  getNotifications() {
    this.http.get(
      environment.SERVER_URL + pathUtils.GET_NOTIFICATIONS + this.lastNotifId,
      AppSettings.OPTIONS)
      .map((res:Response) => res.json())
      .subscribe(
        response => {

        if (response.length != 0) {
          this.showNoNotif = false;
          for (var i = 0; i < response.length; i++) {
            this.listNotif.push(response[i]);
            this.lastNotifId = response[i]._id;
          }
          if (response.length == 5)
            this.showButtonMoreNotif = true;
          else
            this.showButtonMoreNotif = false;
        } else {
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
  }

  onScrollDown(){
    if(this.showNoNotif || this.noMoreNotif){
      return ;
    }
    this.getNotifications();
  }


  getNotificationTime(publishDateString:string):string {
    let date = new Date();
    let currentDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
    let publishDate = this.dateService.convertIsoToDate(publishDateString);
    var displayedDate = "";

    let diffDate = this.dateService.getdiffDate(publishDate, currentDate);
    if (diffDate.day > 28) {
      displayedDate = this.dateService.convertPublishDate(publishDate);
    }
    else if (diffDate.day && diffDate.day == 1) {
      displayedDate = this.translateCode("prefix_date_yesterday");
    }
    else if (diffDate.day > 0) {
      displayedDate = diffDate.day + this.translateCode("prefix_date_days");
    }
    else if ((diffDate.hour) && (diffDate.hour == 1)) {
      displayedDate = this.translateCode("prefix_date_one_hour");
    }
    else if ((diffDate.hour) && (diffDate.hour > 0)) {
      displayedDate = diffDate.hour + this.translateCode("prefix_date_hours");
    }
    else if ((diffDate.min) && (diffDate.min > 1))
      displayedDate = diffDate.min + this.translateCode("prefix_date_minutes");
    else
      displayedDate = this.translateCode("prefix_date_now");
    return displayedDate;
  }


  goTo(source, parm, notifId) {
    this.markView(notifId);
    this.router.navigate(["/main/" + source, parm]);
  }

  markView(notifId) {
    let body = JSON.stringify({
      notificationId: notifId
    });
    this.http.post(environment.SERVER_URL + pathUtils.MARK_VIEW, body, AppSettings.OPTIONS)
      .map((res:Response) => res.json())
      .subscribe(
        response => {

      },
        err => {
      },
      () => {
      });
  }

  translateCode(code) {
    let message;
    this.translate.get(code).subscribe((resTranslate:string) => {
      message = resTranslate;
    });
    return message;
  }

  ngOnInit(){

  }
}




