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
    this.date = "02:46";
    this.notread = false;
    this.myLastMessage = true;
    this.lastMessage = "Bonjour";
    this.user = "Leyana";
    this.userImage = "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&h=350";
  }

  ngOnInit() {
    console.log(this.myLastMessage);
    if(this.myLastMessage){
      this.lastMessage = "Vous : "+this.lastMessage;
    }
  }
}
