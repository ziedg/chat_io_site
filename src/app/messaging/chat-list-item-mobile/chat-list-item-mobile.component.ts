import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chat-list-item-mobile',
  templateUrl: './chat-list-item-mobile.component.html',
  styleUrls: ['./chat-list-item-mobile.component.css']
})
export class ChatListItemMobileComponent implements OnInit {
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

  ngOnInit() {
  }
}
