import 'rxjs/add/operator/map';

import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '../../../../environments/environment';
import { User } from '../../../beans/user';
import { LoginService } from '../../../login/services/loginService';
import { AppSettings } from '../../../shared/conf/app-settings';
import * as pathUtils from '../../../utils/path.utils';


declare var jQuery: any;
declare var $: any;

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
  @ViewChild('container') container: ElementRef;

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


    this.displayShowMore = this.popularProfiles.length >= this.displayedNumberPopularProfiles;
  if (this.displayedNumberPopularProfiles % 20 === 0 || (this.displayedNumberPopularProfiles % 20) % 8 ===0){
      this.loadPopularProfiles(this.lastPopularProfileID);
    }

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
