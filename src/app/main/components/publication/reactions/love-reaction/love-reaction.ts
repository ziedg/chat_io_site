import { Component, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'love-reaction',
  templateUrl: './love-reaction.html',
  styleUrls: ['./love-reaction.css']
})
export class LoveReaction {
  @Input('checked') checked:boolean = false;
  @ViewChild('button') button : ElementRef;

  toggleRecation() {
    this.checked = !this.checked;
  }
}
