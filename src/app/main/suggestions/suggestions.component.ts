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
  }


}
