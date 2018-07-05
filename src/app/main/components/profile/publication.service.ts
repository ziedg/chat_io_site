import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import * as pathUtils from '../../../utils/path.utils';
import { AppSettings } from '../../../shared/conf/app-settings';
import { Http } from '@angular/http';
@Injectable()
export class PublicationService {
  

  constructor(private http: Http) {}

  

  loadFirstPosts(userDisplayedId): Observable<any> {
    let urlAndPara = environment.SERVER_URL +
      pathUtils.GET_PROFILE_PUBLICATIONS
        .replace("PROFILE_ID", userDisplayedId);
    return this.http.get(
      urlAndPara, AppSettings.OPTIONS);
  }
}