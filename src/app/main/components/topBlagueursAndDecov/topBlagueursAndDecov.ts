import { Component, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

/* conf */
import { AppSettings } from '../../../shared/conf/app-settings';
import { environment } from "../../../../environments/environment";

/* services */
import { LoginService } from '../../../login/services/loginService';
import {TranslateService} from '@ngx-translate/core';

/* beans  */
import { User } from '../../../beans/user';

/** Utils */
import * as pathUtils from '../../../utils/path.utils';


@Component({
  moduleId: module.id,
  selector: 'top-blagueurs-decov',
  templateUrl: 'topBlagueursAndDecov.html'
})
export class TopBlagueursAndDecov {

  public popularProfiles: Array<User> = [];
  displayedNumberPopularProfiles = 4;
  displayShowMore: boolean = true;
  //changes
  lastPopularProfileID;
  //
  public user: User = new User();

  @Output() loadPublications = new EventEmitter<any>();

  constructor(public translate: TranslateService,
    private http: Http,
    private router: Router,
    private loginService: LoginService,
    private changeDetector: ChangeDetectorRef) {
    loginService.redirect();
    this.user = loginService.user;
    this.loadPopularProfiles();
  }

  loadMoreProfiles() {
    this.displayedNumberPopularProfiles = this.displayedNumberPopularProfiles + 4;
    this.displayShowMore = this.displayedNumberPopularProfiles < 12 &&
      										 this.popularProfiles.length >= this.displayedNumberPopularProfiles;
  }

  loadPopularProfiles(Id_Profile?: string) {
    var url: string = environment.SERVER_URL + pathUtils.GET_POPULAR_PROFILES + '/';
    if (Id_Profile) { url += Id_Profile }
    this.http.get(url,
      AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          Array.prototype.push.apply(this.popularProfiles, response.profiles);
          //changes
          if (response.profiles && response.profiles.length) {
            this.lastPopularProfileID = response.profiles[response.profiles.length - 1]._id;
          }
          //
        },
        err => {
        },
        () => {
          this.changeDetector.markForCheck();
        }
      );
  }

  //changes
  loadMore() {
    if (this.popularProfiles.length < 6) {
      this.loadPopularProfiles(this.lastPopularProfileID);
    }

  }
  //




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
            this.popularProfiles.splice(this.popularProfiles.indexOf(user), 1);
            this.loadMore();
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
            this.popularProfiles.splice(this.popularProfiles.indexOf(user), 1);
            this.loadMore();
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


}
