import { Observable } from 'rxjs/Observable';
import { AppSettings } from './../../shared/conf/app-settings';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {environment} from "../../../environments/environment";
import { urlB64ToUint8Array, VAPID_PUBLIC_KEY } from '../../utils/notification';
import {BehaviorSubject} from "rxjs"


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  subscriptionJson = '';
  isSubscribed = false;
  registration = undefined;
  public subscription =''



  constructor(private http: Http) { }


  //send subscription to the server
  addPushSubscriber(sub:any) {
    return this.http.post(environment.SERVER_URL +'api/push-subscribe', sub,AppSettings.OPTIONS);
  }

  sendNotification(user_id:any) {
    return this.http.post(environment.SERVER_URL +'send', AppSettings.OPTIONS);
  }




  //subscribe user
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
      this.addPushSubscriber(subscription).subscribe(
        () => console.log('Sent push subscription object to server.'),
        err =>  console.log('Could not send subscription object to server, reason: ', err));
    } else {
      this.subscriptionJson = '';
    }
  }


  removePushSubscriber(){
     const sub = this.subscription;
     console.log(sub)
    return  this.http.post(environment.SERVER_URL +'api/push-unsubscribe',sub,AppSettings.OPTIONS);
  }





public init(reg) {
  this.registration=reg;
  this.registration.pushManager.getSubscription().then(subscription => {
    this.isSubscribed = !(subscription === null);
    this.subscription=subscription;
    this.updateSubscriptionOnServer(subscription);

    console.log(`User ${this.isSubscribed ? 'IS' : 'is NOT'} subscribed.`);
    if (!this.isSubscribed){
      this.subscribeUser()
    }
  });
}

}
