import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chat-list-item',
  templateUrl: './chat-list-item.component.html',
  styleUrls: ['./chat-list-item.component.css']
})
export class ChatListItemComponent  {
  @Input() myLastMessage;
  @Input() lastMessage;
  @Input() user;
  @Input() userImage;
  @Input() notread;
  @Input() date;
  constructor() { 
    this.date =this.getCurrentDate();
    this.notread = true;
    this.myLastMessage = false;
    this.lastMessage = "";
    this.user = "";
    this.userImage = "";

  }


  getCurrentDate(){
    var today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; 

    let yyyy = today.getFullYear();
    if(dd<10){
    var day='0'+dd;
    } 
    if(mm<10){
    var month='0'+mm;
    } 
    var currentDate = day+'-'+month+'-'+yyyy;
    return currentDate

  }

}
