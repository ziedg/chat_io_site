import {Component, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

/* conf */
import {AppSettings} from '../../conf/app-settings';

/* services */
import {LoginService} from '../../service/loginService';
import {DateService} from "../../service/dateService";
import {NotificationBean} from "../../beans/notification-bean";
import {User} from "../../beans/user";
import {environment} from "../../../environments/environment";


@Component({
  moduleId: module.id,
    selector: 'notification',
    templateUrl: 'notification.html',
    changeDetection: ChangeDetectionStrategy.OnPush,

})


export class Notification {
    lastNotifId="";
    showButtonMoreNotif:Boolean=false;
    showNoNotif:Boolean=false;
    listNotif : Array <NotificationBean>;
    user:User = new User();
    noMoreNotif:Boolean=false;
    constructor(private dateService:DateService,private http:Http, private router:Router, private loginService:LoginService,private changeDetector: ChangeDetectorRef) {
        this.listNotif=[];

        if(!this.loginService.isConnected()){
            if(this.loginService.isWasConnectedWithFacebook()){
                this.router.navigate(['/login/facebook-login']);
            }else{
                this.router.navigate(['/login/sign-in']);
            }
        }
        this.user = this.loginService.getUser();
        this.loadFirstNotification();
    }
    loadFirstNotification(){
        this.lastNotifId="";
        this.showNoNotif=false;
        if(this.user) {
            this.http.get(environment.SERVER_URL + 'getNotifications?profileId=' + this.user._id + '&lastNotificationId=', AppSettings.OPTIONS)
                .map((res: Response) => res.json())
                .subscribe(
                    response => {
                        if(response.length){
                            this.listNotif=response;
                            this.changeDetector.markForCheck();
                            this.showNoNotif=false;
                            this.lastNotifId=response[response.length-1]._id;
                            this.load5MoreNotif();
                        }
                        else {
                            this.showNoNotif=true;
                        }
                    },
                    err => {
                    },
                    () => {
                        this.changeDetector.markForCheck();
                        if(!this.noMoreNotif){
                            this.load5MoreNotif();
                        }
                    }
                );
        }
    }
    load5MoreNotif(){
        this.http.get(environment.SERVER_URL + 'getNotifications?profileId=' + this.user._id + '&lastNotificationId='+this.lastNotifId, AppSettings.OPTIONS)
                .map((res: Response) => res.json())
                .subscribe(
                    response => {
                        if(response.length){
                           this.noMoreNotif=false;
                           for(var i=0;i<response.length;i++){
                               this.listNotif.push(response[i]);
                               this.lastNotifId=response[i]._id;
                               this.changeDetector.markForCheck();
                           }
                        }
                        else {
                            this.noMoreNotif=true;
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
               return 0;
        }
        this.load5MoreNotif();
        this.changeDetector.markForCheck();
    }
    getNotificationTime(publishDateString: string): string {


        let date = new Date();
        let currentDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
        let publishDate = this.dateService.convertIsoToDate(publishDateString);
        var displayedDate="";

        let diffDate = this.dateService.getdiffDate(publishDate, currentDate);
        if (diffDate.day > 28) {
            displayedDate = this.dateService.convertPublishDate(publishDate);
        }
        else if (diffDate.day &&  diffDate.day == 1) {
            displayedDate = "hier";
        }
        else if (diffDate.day > 0) {
            displayedDate = diffDate.day + " jour(s)";
        }
        else if ((diffDate.hour) && (diffDate.hour == 1)) {
            displayedDate =  "1 h";
        }
        else if ((diffDate.hour) && (diffDate.hour > 0)) {
            displayedDate = diffDate.hour + " h";
        }
        else if ((diffDate.min) && (diffDate.min > 1))
            displayedDate = diffDate.min + " min(s)";
        else
            displayedDate = "maintenant";
        return displayedDate;
    }
    goTo(source,parm,notifId){
        let body = JSON.stringify({
            notificationId: notifId
        });
        this.http.post(environment.SERVER_URL + 'setNotificationSeen ', body, AppSettings.OPTIONS)
            .map((res: Response) => res.json())
            .subscribe(
                response => {
                },
                err => { },
                () => {});
        this.router.navigate(["/main/"+source,parm]);

    }
}




