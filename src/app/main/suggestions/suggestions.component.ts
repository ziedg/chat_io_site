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
  last_index:number = 0;

  constructor(private changeDetector: ChangeDetectorRef,
              private http: Http) {
    /*for(var i=0;i<5; i++) {
      this.popularProfiles.push()
    }*/
    this.loadPopularProfiles("null");
    console.log("populaire profiles" + this.popularProfiles);
  }

  ngOnInit() {
    setTimeout(function () {
      var nodeList = document.getElementsByClassName('draggable');
      for (var i = 0; i < nodeList.length; i++) {
        //var obj = nodeList[0];w
        const obj = nodeList[i];
        obj.setAttribute('verif', '0');
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
          false);
      }
    }, 1000);

    window.onscroll = this.onScroll;
  }

  onScroll(event) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.loadPopularProfiles(this.popularProfiles[this.popularProfiles.length -1]._id);
    }
  }

  

  loadPopularProfiles(Id_Profile:string) {

    if(this.popularProfiles.length == 30)
      return;

    var url:string = environment.SERVER_URL + pathUtils.GET_POPULAR_PROFILES +'/'+ Id_Profile;
    this.http.get(url,
      AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          Array.prototype.push.apply(this.popularProfiles, response.profiles);
          console.log(this.popularProfiles);
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
    var verif = parseInt(obj_src.getAttribute('verif'));
    if (verif) {
      w = 100 + touch.pageX - old_x;
    }
    if (w > 0) {
      var el = obj_src.parentNode.querySelector('.msg-draggable');

      el.style.setProperty('min-width', w + 'px');
      //bla.innerHTML = touch.pageX - old_x;
    }
    //event.preventDefault();
  }

  static onTouchStart(event, obj) {
    console.log('touch start');
    var obj_src = obj;
    var touch = event.targetTouches[0];
    obj_src.setAttribute('old_x', touch.pageX);
    event.preventDefault();
    obj_src.classList.add('on-drag');
    obj_src.style.setProperty('min-width', getComputedStyle(obj_src).width);
  }

  static onTouchEnd(event, obj) {
    console.log('touch end');
    var obj_src = obj;
    var touch = event.changedTouches[0];
    var old_x = parseInt(obj_src.getAttribute('old_x'));
    var verif = parseInt(obj_src.getAttribute('verif'));

    var cont = obj_src.parentNode;
    var el = cont.querySelector('.msg-draggable');
    var drag_h = parseInt(getComputedStyle(obj_src).height, 10);
    var drag_h_2 = 90;
    if ((touch.pageX - old_x) > drag_h + drag_h_2) {
      SuggestionsComponent.disappear(obj_src, cont, el);
    }
    else {
      if (!verif) {
        if ((touch.pageX - old_x) > drag_h) {
          el.style.setProperty('min-width', drag_h + 'px');
          obj_src.setAttribute('verif', '1');
        }
        else {
          el.style.setProperty('min-width', '0px');
          obj_src.classList.remove('on-drag');
          obj_src.style.setProperty('min-width', 'auto');
        }
      }
      else {
        if ((touch.pageX - old_x) > drag_h_2) {
          SuggestionsComponent.disappear(obj_src, cont, el);
        }
        else if ((touch.pageX - old_x) < 0) {
          obj_src.setAttribute('verif', '0');
          //console.log(el.style);
          el.style.setProperty('min-width', '0px');
          obj_src.classList.remove('on-drag');
          obj_src.style.setProperty('min-width', 'auto');
        }
        else {
          el.style.setProperty('min-width', drag_h + 'px');
        }
      }
    }
    //event.preventDefault();
  }

  static disappear(obj, cont, el) {
    console.log('disappear');
    obj.style.setProperty('width', '0', 'important');
    obj.style.setProperty('flex-grow', '0', 'important');
    obj.classList.add('disappear');
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
