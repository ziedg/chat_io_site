import 'rxjs/add/operator/map';

import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '../../../../environments/environment';
import { User } from '../../../beans/user';
import { LoginService } from '../../../login/services/loginService';
import { AppSettings } from '../../../shared/conf/app-settings';
import * as pathUtils from '../../../utils/path.utils';


@Component({
    moduleId: module.id,
    selector: 'facebook-friends',
    templateUrl: 'facebookFriends.html'
  })

export class FacebookFriends {

    public facebookProfiles: Array<User> = [];
    displayedNumberfacebookProfiles = 2;
    page = 1;
    isValid : boolean = false;

    public user: User = new User();

    constructor(public translate: TranslateService,
        private http: Http,
        private router: Router,
        private loginService: LoginService,
        private changeDetector: ChangeDetectorRef) {
        loginService.redirect();
        this.user = loginService.user;
        this.page = 1;
        this.loadfacebookProfiles(this.user._id);  
            
        }

  
    loadfacebookProfiles(Id_Profile?: string) {

        var url: string = environment.SERVER_URL + pathUtils.GET_FACEBOOK_FRIENDS + String(this.page);

        this.http.get(url,
            AppSettings.OPTIONS)
            .map((res: Response) => res.json())
            .subscribe(
              response => {

                Array.prototype.push.apply(this.facebookProfiles, response.message);
                this.isValid = this.facebookProfiles.length != 0;
            },
            err => {
            },
            () => {
              this.changeDetector.markForCheck();
            }
          );
    } 

    subscribe(user: User) {
        let body = JSON.stringify({
          profileId: user._id
        });
    
        this.http.post(
          environment.SERVER_URL + pathUtils.SUBSCRIBE,
          body,
          AppSettings.OPTIONS
        )
          .map((res: Response) => res.json())
          .subscribe(
            response => {
              if (response.status == 0) {
                this.facebookProfiles.splice(this.facebookProfiles.indexOf(user), 1);
              }
            },
            err => {
            },
            () => {
              this.changeDetector.markForCheck();
            }
          );
    
    }

    unsubscribe(user: User) {
        let body = JSON.stringify({
          profileId: user._id
        });
    
        this.http.post(
          environment.SERVER_URL + pathUtils.UNSUBSCRIBE,
          body,
          AppSettings.OPTIONS)
          .map((res: Response) => res.json())
          .subscribe(
            response => {
              if (response.status == 0) {
                user.isFollowed = false;
                user.nbSuivi--;
              }
            },
            err => {
            },
            () => {
              this.changeDetector.markForCheck();
            }
          );
    }

    ignore(user: User) {
        let body = JSON.stringify({
          profileId: user._id
        });

        this.http.post(
          environment.SERVER_URL + pathUtils.IGNORE,
          body,
          AppSettings.OPTIONS
        )
          .map((res: Response) => res.json())
          .subscribe(
            response => {
              if (response.status == 0) {
                this.facebookProfiles.splice(this.facebookProfiles.indexOf(user), 1);
              }
            },
            err => {
            },
            () => {
              this.changeDetector.markForCheck();
            }
          );
    
    
    }

    loadmore() {
      this.page++;
      this.loadfacebookProfiles(this.user._id);

    }

}