import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chat-list-item',
  templateUrl: './chat-list-item.component.html',
  styleUrls: ['./chat-list-item.component.css']
})
export class ChatListItemComponent implements OnInit{
  @Input() myLastMessage;
  @Input() lastMessage;
  @Input() user;
  @Input() userImage;
  @Input() notread;
  @Input() date;

  constructor() {
    this.date = "";
    this.notread = false;
    this.myLastMessage = false;
    this.lastMessage = "";
    this.user = "";
    this.userImage = "";

  }

  ngOnInit(){
    console.log(this.myLastMessage);
  }
}
