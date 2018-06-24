import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chat-list-item',
  templateUrl: './chat-list-item.component.html',
  styleUrls: ['./chat-list-item.component.css']
})
export class ChatListItemComponent implements OnInit {
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
      this.lastMessage = "Vous : Bonjour";
    }else{
      this.lastMessage = "Bonjour";
    }
  }

}
