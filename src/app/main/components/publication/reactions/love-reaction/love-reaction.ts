import { Component, Input } from '@angular/core';

@Component({
  selector: 'love-reaction',
  templateUrl: './love-reaction.html',
  styleUrls: ['./love-reaction.css']
})
export class LoveReaction {
  @Input('checked') checked:boolean = false;
}
