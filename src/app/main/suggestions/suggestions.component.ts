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
    /*
    setTimeout(function () {
      var nodeList = document.getElementsByClassName('draggable');
      for (var i = 0; i < nodeList.length; i++) {
        const obj = nodeList[i];
        obj.setAttribute('old_x', '0');

        obj.addEventListener('touchmove',
          function (event) {
            SuggestionsComponent.onTouchMove(event, obj)
          }, true);

        obj.addEventListener('touchstart',
          function (event) {
            SuggestionsComponent.onTouchStart(event, obj)
          },
          true);

        obj.addEventListener('touchend',
          function (event) {
            SuggestionsComponent.onTouchEnd(event, obj)
          },
          true);
      }
    }, 1000);*/

    window.onscroll = this.onScroll.bind(this);
  }

  onScroll(event) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      console.log('reach end of body');
      this.loadPopularProfiles(this.popularProfiles[this.popularProfiles.length-1]._id);
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


  static onTouchMove(event, obj) {
    var obj_src = obj;
    var touch = event.targetTouches[0];
    var old_x = parseInt(obj_src.getAttribute('old_x'));
    var w = touch.pageX - old_x;
    if (w > 0) {
      var el = obj_src.parentNode.querySelector('.msg-draggable');
      el.style.setProperty('min-width', w + 'px');
    }
  }

  static onTouchStart(event, obj) {
    console.log('touch start');
    var obj_src = obj;
    var touch = event.targetTouches[0];
    obj_src.setAttribute('old_x', touch.pageX);
    obj_src.style.setProperty('min-width', getComputedStyle(obj_src).width);
  }

  static onTouchEnd(event, obj) {
    console.log('touch end');
    var obj_src = obj;
    var touch = event.changedTouches[0];
    var old_x = parseInt(obj_src.getAttribute('old_x'));
    var cont = obj_src.parentNode;
    var el = cont.querySelector('.msg-draggable');
    if ((touch.pageX - old_x) > 100) {
      SuggestionsComponent.disappear(obj_src, cont, el);
    }
        else {
          el.style.setProperty('min-width', '0px');
          obj_src.style.setProperty('min-width', 'auto');
        }
      }

  static disappear(obj, cont, el) {
    console.log('disappear');
    obj.style.setProperty('width', '0', 'important');
    obj.style.setProperty('flex-grow', '0', 'important');
    el.classList.add('msg-bye');
    cont.style.setProperty('opacity', 0);
    setInterval(function () {
      cont.style.display = 'none';
    }, 650);
    //this.ignore(user);
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
    var obj = event.srcElement;

    this.subscribe(user);
    //this.disapear2()
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


  disapear2(obj) {

  }
}
