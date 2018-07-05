import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import * as pathUtils from '../../../utils/path.utils';
import { AppSettings } from '../../../shared/conf/app-settings';
import { Http } from '@angular/http';
@Injectable()
export class ProfileService {
  

  constructor(private http: Http) {}

  getProfile(userId:string): Observable<any> {
    return this.http.get(
        environment.SERVER_URL + pathUtils.GET_PROFILE + userId,
        AppSettings.OPTIONS) ;
  }

  
}