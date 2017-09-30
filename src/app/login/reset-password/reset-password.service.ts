/**
 * Created by chaker on 27/11/16.
 */


import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
/* conf */
import {AppSettings} from '../../conf/app-settings';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ResetPasswordService {

  constructor(private http: Http) {
  }

  resetPassword(params: any): Promise<any> {

    return this.http.post(AppSettings.SERVER_URL + 'resetPwd', JSON.stringify(params), AppSettings.OPTIONS)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body;
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Promise.reject(errMsg);
  }

}
