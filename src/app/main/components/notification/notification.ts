import 'rxjs/add/operator/map';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '../../../../environments/environment';
import { NotificationBean } from '../../../beans/notification-bean';
import { User } from '../../../beans/user';
import { LoginService } from '../../../login/services/loginService';
import { AppSettings } from '../../../shared/conf/app-settings';
import * as pathUtils from '../../../utils/path.utils';
import { DateService } from '../../services/dateService';

@Component({
    selector: 'notification',
    templateUrl: 'notification.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})


export class Notification implements OnInit {
    lastNotifId="";
    index=12;
    isLock: boolean = false;
    showButtonMoreNotif:Boolean=false;
    showNoNotif:Boolean=false;
    listNotif : Array <NotificationBean> = [];
    user:User = new User();
    noMoreNotif:Boolean=false;
    loaded: Boolean = false;

    constructor(public translate:TranslateService,
                private dateService:DateService,
                private http:Http,
                private router:Router,
                private loginService:LoginService,
                private changeDetector: ChangeDetectorRef) {
        this.listNotif=[];
        this.lastNotifId="";
      this.loginService.redirect();
      this.user = this.loginService.getUser();

        this.loadFirstNotifactions();
    }

  loadFirstNotifactions() {
    this.listNotif = [];
    this.getNotifications();
  }


  getNotifications() {
    this.isLock=true;
    var indexx =this.index.toString();
    this.http.get(
      environment.SERVER_URL + pathUtils.GET_NOTIFICATIONS.replace("INDEX",indexx).replace("LAST",this.lastNotifId),
      AppSettings.OPTIONS)
      .map((res:Response) => res.json())
      .subscribe(
        response => {

        if (response.length != 0) {
          this.showNoNotif = false;
          for (let i = 0; i < response.length; i++) {
            if(response[i].publType === "text" && response[i].publText != null){
              response[i].publText = this.strip_html_tags(response[i].publText);
              this.listNotif.push(response[i]); }
              else{
                this.listNotif.push(response[i]);
              }
            this.lastNotifId = response[i]._id;
          }
          this.index=5;
          this.isLock=false;
          this.loaded = true;
          
        } else {
          this.showNoNotif = true;

          this.isLock=false;
        }
      },
        err => {
      },
      () => {
        this.changeDetector.markForCheck();
      }
    );
  }

  strip_html_tags(str)
  {
    str = str.toString();
    str = str.replace("</","");
    return str.replace(/<([^;]*)>/g, ' ');
  }

  onScrollDown(){
    if(this.showNoNotif || this.noMoreNotif || this.isLock){
      return ;
    }
    this.getNotifications();
  }


  getNotificationTime(publishDateString:string):string {
    let date = new Date();
    let currentDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
    let publishDate = this.dateService.convertIsoToDate(publishDateString);
    let displayedDate = "";

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




