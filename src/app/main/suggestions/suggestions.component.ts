import { Component, OnInit } from '@angular/core';
import {User} from "../../beans/user";

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html'
})
export class SuggestionsComponent implements OnInit {
  users:Array<User> = [];

  constructor() {
    var user = new User();
    user.firstName="Rafaa";
    user.lastName="Seddik";
    user.nbSubscribers=5;
    user.profilePicture = user.profilePictureMin = "assets/pictures/man.png";
    this.users.push(user);
    this.users.push(user);
    this.users.push(user);
    this.users.push(user);
  }

  ngOnInit() {
    setTimeout(function() {
      var nodeList = document.getElementsByClassName('draggable');
      for (var i = 0; i < nodeList.length; i++) {
        //var obj = nodeList[0];w
        const obj = nodeList[i];
        obj.setAttribute('verif', '0');
        obj.setAttribute('old_x', '0');
        obj.addEventListener('touchmove',
          function(event){SuggestionsComponent.onTouchMove(event, obj)}, false);

        obj.addEventListener('touchstart',
          function(event){SuggestionsComponent.onTouchStart(event, obj)},
          false);

        obj.addEventListener('touchend',
          function(event){SuggestionsComponent.onTouchEnd(event, obj)},
          false);
      }
    },1000);

  }

  static onTouchMove(event, obj){
    var obj_src = obj;
    var touch = event.targetTouches[0];
    var old_x = parseInt(obj_src.getAttribute('old_x'));
    var w = touch.pageX - old_x;
    var verif = parseInt(obj_src.getAttribute('verif'));
    if(verif) {
      w = 100 + touch.pageX - old_x;
    }
    if(w > 0) {
      var el = obj_src.parentNode.querySelector('.msg-draggable');

      el.style.setProperty('min-width', w+'px');
      //bla.innerHTML = touch.pageX - old_x;
    }
    event.preventDefault();
   }

  static onTouchStart(event, obj) {
    console.log('touch start');
    var obj_src = obj;
    var touch = event.targetTouches[0];
    obj_src.setAttribute('old_x', touch.pageX);
    event.preventDefault();
    obj_src.classList.add('on-drag');
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
    console.log(drag_h);
    if((touch.pageX - old_x)>2*drag_h) {
        SuggestionsComponent.disappear(obj_src, cont, el);
    }
    else {
    if(!verif) {
      if((touch.pageX - old_x)>drag_h){
        el.style.setProperty('min-width', drag_h+'px');
        obj_src.setAttribute('verif', '1');
      }
      else {
        el.style.setProperty('min-width', '0px');
        obj_src.classList.remove('on-drag');
        }
      }
    else {
      if((touch.pageX - old_x)>drag_h) {
        SuggestionsComponent.disappear(obj_src, cont, el);
      }
      else if((touch.pageX - old_x)<0) {
        obj_src.setAttribute('verif', '0');
        //console.log(el.style);
        el.style.setProperty('min-width', '0px');
        obj_src.classList.remove('on-drag');
      }
      else {
        el.style.setProperty('min-width', drag_h+'px');
      }
    }
    }
        event.preventDefault();
  }

  static disappear(obj, cont, el) {
    console.log('disappear');
    obj.style.setProperty('width', '0', 'important');
    obj.style.setProperty('flex-grow', '0', 'important');
    obj.classList.add('disappear');
    el.classList.add('msg-bye');
    cont.style.setProperty('opacity', 0);
    setInterval(function(){cont.style.display = 'none';}, 500);
  }

}
