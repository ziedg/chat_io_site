import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {User} from "../../beans/user";
import {environment} from "../../../environments/environment";
import {AppSettings} from "../../conf/app-settings";
import * as pathUtils from "../../utils/path.utils";

import {Http, Response, Headers, RequestOptions} from '@angular/http';


@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html'
})
export class SuggestionsComponent implements OnInit {
  popularProfiles: Array<User> = [];

  constructor(private changeDetector: ChangeDetectorRef,
              private http: Http) {
    this.loadPopularProfiles();
  }

  ngOnInit() {
    window.onscroll = this.onScroll.bind(this);
  }

  onScroll(event) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {

      if(this.popularProfiles.length > 0)
      {this.loadPopularProfiles(this.popularProfiles[this.popularProfiles.length-1]._id);}
    }
  }

  loadPopularProfiles(Id_Profile?:string) {

    if(this.popularProfiles.length === 30)
      return;

    var url:string = environment.SERVER_URL + pathUtils.GET_POPULAR_PROFILES +'/';
    if(Id_Profile){ url+= Id_Profile}
    this.http.get(url,
      AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          Array.prototype.push.apply(this.popularProfiles, response.profiles);
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
            this.popularProfiles.splice(this.popularProfiles.indexOf(user), 1);
          }
        },
        err => {
        },
        () => {
          this.changeDetector.markForCheck();
        }
      );
  }

  subscribeClick(event, user:User) {
  
    var obj = event.target;
    var obj_del = obj.parentNode.parentNode.parentNode;

    obj_del.style.opacity = '0';

    setTimeout(function(){obj_del.parentNode.removeChild(obj_del);}, 500);

    if(this.popularProfiles.length<5){
      this.loadPopularProfiles(this.popularProfiles[this.popularProfiles.length-1]._id);
    }

    this.subscribe(user);
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
