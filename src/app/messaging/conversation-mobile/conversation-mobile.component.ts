import { Component, OnInit } from '@angular/core';
declare var jQuery: any;
@Component({
  selector: 'app-conversation-mobile',
  templateUrl: './conversation-mobile.component.html',
  styleUrls: ['./conversation-mobile.component.css']
})
export class ConversationMobileComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    jQuery(".navigation-bottom").addClass('hidden-xs');
  }

}
