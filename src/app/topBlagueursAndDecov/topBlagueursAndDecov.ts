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
import {Blagueur} from '../beans/Blagueur';

/** Utils */
import * as pathUtils from '../utils/path.utils';


@Component({
  moduleId: module.id,
  selector: 'top-blagueurs-decov',
  templateUrl: 'topBlagueursAndDecov.html'
})
export class TopBlagueursAndDecov {
  public topBlagueursDisplayList:Array <User> = [];
  public DecovDisplayList:Array <User> = [];

  public topBlagueursList:Array <Blagueur> = [];
  public DecovList:Array <Blagueur> = [];

  public user:User = new User();

  nbBlagueursDisplayed = 0;
  nbDecovDisplayed = 0;
  nbMaxElements = 3;
  profiles;

  @Output() loadPublications = new EventEmitter<any>();

  constructor(public translate:TranslateService,
              private http:Http,
              private router:Router,
              private loginService:LoginService,
              private changeDetector:ChangeDetectorRef) {
    loginService.redirect();
    this.user = loginService.user;
    this.loadtopBlagueursList();
    this.loadDecovList();
  }

  loadtopBlagueursList() {
    this.http.get(
      environment.SERVER_URL
      + pathUtils.GET_POPULAR_PROFILES,
      AppSettings.OPTIONS)
      .map((res:Response) => res.json())
      .subscribe(
        response => {
        this.topBlagueursList = response.profiles;
        for (var i = 0; i < this.nbMaxElements && i < response.profiles.length; i++) {
          this.topBlagueursDisplayList[i] = this.topBlagueursList[i];
          //this.topBlagueursDisplayList[i].position = i;
        }
        this.nbBlagueursDisplayed = this.nbMaxElements;
      },
        err => {
      },
      () => {
        this.changeDetector.markForCheck();
      }
    );
  }

  loadDecovList() {
    this.http.get(
      environment.SERVER_URL
      + pathUtils.GET_PROFILES_SUGGESTIONS,
      AppSettings.OPTIONS)
      .map((res:Response) => res.json())
      .subscribe(
        response => {
        this.DecovList = response.profiles;
        for (var i = 0; i < this.nbMaxElements && i < response.profiles.length; i++) {
          this.DecovDisplayList[i] = this.DecovList[i];
          //this.DecovDisplayList[i].position = i;
        }
        this.nbDecovDisplayed = this.nbMaxElements;
      },
        err => {
      },
      () => {
        this.changeDetector.markForCheck();
      }
    );
  }


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
          this.topBlagueursDisplayList.splice(this.topBlagueursDisplayList.indexOf(user), 1)
        }
      },
        err => {
      },
      () => {
        this.changeDetector.markForCheck();
      }
    );
  }

  unsubscribe(userDisplayed:User) {
    let body = JSON.stringify({
      profileId: userDisplayed._id
    });

    this.http.post(
      environment.SERVER_URL + pathUtils.UNSUBSCRIBE,
      body,
      AppSettings.OPTIONS)
      .map((res:Response) => res.json())
      .subscribe(
        response => {
        if (response.status == 0) {
          userDisplayed.isFollowed = false;
          userDisplayed.nbSuivi--;
        }
      },
        err => {
      },
      () => {
        this.changeDetector.markForCheck();
      }
    );
  }


  doNotSubscribeUser(source:string, position:number, profileId:string, blag:Blagueur) {
    blag.isSubscribed = false;
    if (source == "Decov") {
      //this.DecovDisplayList[position].isSubscribed = false;
      this.DecovDisplayList[position].nbSuivi--;
    }
    else {
      //this.topBlagueursDisplayList[position].isSubscribed = false;
      this.topBlagueursDisplayList[position].nbSuivi--;
    }
    this.changeDetector.markForCheck();

    let body = JSON.stringify({
      UserId: this.user._id,
      profileId: profileId
    });

    this.http.post(environment.SERVER_URL + 'removeSubscribe', body, AppSettings.OPTIONS)
      .map((res:Response) => res.json())
      .subscribe(
        response => {

      },
        err => {
      },
      () => {
        this.changeDetector.markForCheck();
      }
    );
  }

  subscribeUser(source:string, position:number, profileId:string, blag:Blagueur) {
    blag.isSubscribed = true;
    if (source == "Decov") {

      //this.DecovDisplayList[position].isSubscribed = true;
      this.DecovDisplayList[position].nbSuivi++;

    }
    else {
      //this.topBlagueursDisplayList[position].isSubscribed = true;
      this.topBlagueursDisplayList[position].nbSuivi++;

    }
    this.changeDetector.markForCheck();

    let body = JSON.stringify({
      UserId: this.user._id,
      profileId: profileId
    });

    this.http.post(environment.SERVER_URL + 'subscribe', body, AppSettings.OPTIONS)
      .map((res:Response) => res.json())
      .subscribe(
        response => {
        this.loadPublications.emit();
        if (source == "Decov") {
          if (this.nbDecovDisplayed >= this.DecovList.length) {

          }
          else {
            this.DecovDisplayList[position] = this.DecovList[this.nbDecovDisplayed];
            //this.DecovDisplayList[position].position = position;
            //this.DecovDisplayList[position].isSubscribed = false;
            this.nbDecovDisplayed++;
          }
        }
        else {
          if (this.nbBlagueursDisplayed >= this.topBlagueursList.length) {

          }
          else {
            this.topBlagueursDisplayList[position] = this.topBlagueursList[this.nbBlagueursDisplayed];
            //this.topBlagueursDisplayList[position].position = position;
            //this.topBlagueursDisplayList[position].isSubscribed = false;
            this.nbBlagueursDisplayed++;
          }

        }
        this.changeDetector.markForCheck();

      },
        err => {
      },
      () => {
        this.changeDetector.markForCheck();
      }
    );


  }
}
