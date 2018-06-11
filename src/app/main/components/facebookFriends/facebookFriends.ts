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
    displayedNumberfacebookProfiles = 4;
    displayShowMore: boolean = true;

    public user: User = new User();

    constructor(public translate: TranslateService,
        private http: Http,
        private router: Router,
        private loginService: LoginService,
        private changeDetector: ChangeDetectorRef) {
        loginService.redirect();
        this.user = loginService.user;
        this.loadfacebookProfiles(this.user._id);
        console.log('user id'+this.user._id);
    }

    loadfacebookProfiles(Id_Profile?: string) {

        var url: string = environment.SERVER_URL + pathUtils.GET_FACEBOOK_FRIENDS;

        this.http.get(url,
            AppSettings.OPTIONS)
            .map((res: Response) => res.json())
            .subscribe(
              response => {
                console.log("first results");
                console.log(response);
                Array.prototype.push.apply(this.facebookProfiles, response.message);
                console.log("response results");
                console.log(this.facebookProfiles);
            },
            err => {
            },
            () => {
              this.changeDetector.markForCheck();
            }
          );
    }

}