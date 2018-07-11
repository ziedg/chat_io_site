import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'chat-suggestion',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css']
})
export class SuggestionsComponent implements OnInit {
  @Input() user;
  constructor() { }

  ngOnInit() {
  }

}
