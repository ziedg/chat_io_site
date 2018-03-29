import {Component, ChangeDetectorRef, Output, EventEmitter} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

/* conf */
import {AppSettings} from '../conf/app-settings';
import {environment} from "../../environments/environment";

/* services */
import {LoginService} from '../service/loginService';
import { TranslateService } from 'ng2-translate';

/* beans  */
import {User} from '../beans/user';

/** Utils */
import * as pathUtils from '../utils/path.utils';


@Component({
  moduleId: module.id,
  selector: 'top-blagueurs-decov',
  templateUrl: 'topBlagueursAndDecov.html'
})
export class TopBlagueursAndDecov {

  public popularProfiles:Array <User> = [];
  displayedNumberPopularProfiles = 4;
  //changes
  lastPopularProfileID;
  //
  public user:User = new User();

  @Output() loadPublications = new EventEmitter<any>();

  constructor(public translate:TranslateService,
              private http:Http,
              private router:Router,
              private loginService:LoginService,
              private changeDetector:ChangeDetectorRef) {
    loginService.redirect();
    this.user = loginService.user;
    this.loadPopularProfiles();
  }

  loadPopularProfiles(Id_Profile?:string) {

    var url:string = environment.SERVER_URL + pathUtils.GET_POPULAR_PROFILES +'/';
    if(Id_Profile){ url+= Id_Profile}
    this.http.get(url,
      AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          Array.prototype.push.apply(this.popularProfiles, response.profiles);
//changes
if (response.profiles){
          this.lastPopularProfileID = response.profiles[response.profiles.length-1]._id;
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
  loadMore(){
if (this.popularProfiles.length==6){
  this.loadPopularProfiles(this.lastPopularProfileID);
}

  }
//


  subscribe(user:User) {
    let body = JSON.stringify({
      profileId: user._id
    });
    
    this.http.post(
      environment.SERVER_URL + pathUtils.SUBSCRIBE,
      body,
      AppSettings.OPTIONS
    )
      .map((res:Response) => res.json())
      .subscribe(
        response => {
        if (response.status == 0) {
          this.popularProfiles.splice(this.popularProfiles.indexOf(user), 1);
        }
      },
        err => {
      },
      () => {
        this.changeDetector.markForCheck();
      }
    );
    //changes
    this.loadMore();
    //
  }

  ignore(user:User) {
    let body = JSON.stringify({
      profileId: user._id
    });

    this.http.post(
      environment.SERVER_URL + pathUtils.IGNORE,
      body,
      AppSettings.OPTIONS
    )
      .map((res:Response) => res.json())
      .subscribe(
        response => {
        if (response.status == 0) {
          this.popularProfiles.splice(this.popularProfiles.indexOf(user), 1);
        }
      },
        err => {
      },
      () => {
        this.changeDetector.markForCheck();
      }
    );
    //changes
    this.loadMore();
    //
  }

  unsubscribe(user : User) {
    let body = JSON.stringify({
      profileId: user._id
    });

    this.http.post(
      environment.SERVER_URL + pathUtils.UNSUBSCRIBE,
      body,
      AppSettings.OPTIONS)
      .map((res:Response) => res.json())
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
