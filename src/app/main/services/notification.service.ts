import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import { AppSettings } from '../../shared/conf/app-settings';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  addPushSubscriber(sub:any) {
    return this.http.post(environment.SERVER_URL +'notifications', sub);
  }

  sendNotification(user_id:any) {
    return this.http.post(environment.SERVER_URL +'send', AppSettings.OPTIONS);
  }
}
