import { Observable } from 'rxjs/Observable';
import { AppSettings } from './../../shared/conf/app-settings';
import {Injectable, Renderer2} from '@angular/core';
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
  public subscription ='';



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

    document.body.style.paddingTop = "77px";
    document.getElementById("subscribeMsg").style.display = "none";
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
     const subs = this.subscription;
     console.log(subs)
    return  this.http.post(environment.SERVER_URL +'api/push-unsubscribe',subs,AppSettings.OPTIONS);
  }





public init(reg) {
  this.registration=reg;
  this.registration.pushManager.getSubscription().then(subscription => {
    this.isSubscribed = !(subscription === null);
    this.subscription=subscription;

    this.updateSubscriptionOnServer(subscription);

    console.log(`User ${this.isSubscribed ? 'IS' : 'is NOT'} subscribed.`);
    // if (!this.isSubscribed){
    //  this.subscribeUser()
    //}
  });
}

}
