import { Component, OnInit, OnDestroy } from "@angular/core";
import { NotificationService } from "../../../services/notification.service";
import { TranslateService } from "@ngx-translate/core";


@Component({
    selector: 'notification-bar',
    templateUrl: './notification-bar.html',
    styleUrls: ['./notification-bar.css']
})
export class NotificationBar implements OnInit, OnDestroy {
    private registration = undefined;

    constructor(public notificationService: NotificationService,
                public translate: TranslateService){
        
    }

    ngOnInit() {
    // set body padding
    document.body.style.paddingTop = "116px";

    //Notification Check
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        navigator.serviceWorker.register('assets/sw.js').then(reg => {
          this.registration = reg;
          this.notificationService.init(reg);
          //console.log('Service Worker and Push is supported');
        });
      } else {
        //console.warn('Push messaging is not supported');
      }
    }

    ngOnDestroy() {
        document.body.style.paddingTop = "77px";
    }
}