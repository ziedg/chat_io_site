import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-suggestions-mobile',
  templateUrl: './suggestions-mobile.component.html',
  styleUrls: ['./suggestions-mobile.component.css']
})
export class SuggestionsMobileComponent implements OnInit {
  @Input() user;
  constructor() { }

  ngOnInit() {
    console.log("heeere");
    console.log(this.user);
  }

}
