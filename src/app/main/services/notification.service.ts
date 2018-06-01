import { AppSettings } from './../../shared/conf/app-settings';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {environment} from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: Http) { }

  addPushSubscriber(sub:any) {
    return this.http.post(environment.SERVER_URL +'api/push-subscribe', sub,AppSettings.OPTIONS);
  }

  sendNotification(user_id:any) {
    return this.http.post(environment.SERVER_URL +'send', AppSettings.OPTIONS);
  }
}
