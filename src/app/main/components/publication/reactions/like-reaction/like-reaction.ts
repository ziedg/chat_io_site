import { Component, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'like-reaction',
  templateUrl: './like-reaction.html',
  styleUrls: ['./like-reaction.css']
})
export class LikeReaction {
  @Input('checked') checked:boolean = false;
}
