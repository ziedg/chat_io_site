import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';

import { User } from '../../beans/user';
import { ChatService } from '../../messanging/chat.service';
import { EmitterService } from '../emitter.service';
declare var jQuery: any;
class MessageValidation {
	constructor() {
		return [
			'',
			Validators.compose(
				[
					Validators.required,
				],
			),
		];
	}
}

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
  @Input() conversation: string;
  @Input() selectedUserInfo: string;
  public selectedUser: User = null;
	public messageForm: FormGroup;
	private userId: string = null;

  public messages = [];
  public messageLoading = true;
  private s: AngularFireObject<any>;

  constructor(private emitterService:EmitterService,
    private router:Router,
    private db: AngularFireDatabase,
    private chatService: ChatService
  ) { 
		this.messageForm =new FormBuilder().group({
			message: new MessageValidation
		});;
  }

ngOnInit(){
  //this.listenForMessages(this.user._id);
}
  ngOnChanges(changes: any) {
    /* Fetching selected users information from other component. */
    this.emitterService.userEmitter
    .subscribe((selectedUser: User) => {
        this.selectedUser = selectedUser;
    });

    this.emitterService.conversationEmitter.subscribe((data) => {
      this.messageLoading = false;
      if(data==undefined)
      {
        this.messages=[];
      }
      else{
        this.messages = data;
      }
  });
}

sendMessageBtn() {
  //if (event.keyCode === 13) {
      const message = this.messageForm.controls['message'].value.trim();
      if (message === '' || message === undefined || message === null) {
          alert(`Message can't be empty.`);
      } else if (this.userId === '') {
          this.router.navigate(['/']);
      } else if (this.selectedUser._id === '') {
          alert(`Select a user to chat.`);
      } else {
          const data = {
              fromUserId: this.userId,
              message: (message).trim(),
              toUserId: this.selectedUser._id,
          };
          this.messages= [...this.messages, data];
          /* calling method to send the messages */
          this.chatService.sendMessage(data).subscribe(
            () => console.log('Sent Message server.'),
            err =>  console.log('Could send message to server, reason: ', err));
          
          this.messageForm.reset();
          setTimeout(() => {
              document.querySelector(`.message-thread`).scrollTop = document.querySelector(`.message-thread`).scrollHeight;
          }, 100);
      }
  //}
}

listenForMessages(userId: string): void {
  console.log("deeeeesktop listen");
  this.userId = userId;
  this.s = this.db.object('notifications/'+this.userId+'/messaging');
    console.log('notifications/'+this.userId+'/messaging');
    var item = this.s.valueChanges()
    console.log(JSON.stringify(item));
    this.s.snapshotChanges().subscribe(action => {
      var notif = action.payload.val();
      if (notif !== null){
        this.chatService.getMessage(notif.msgId).subscribe(
          message => {
            if (this.selectedUser !== null && this.selectedUser._id === notif.senderId) {
              this.messages = [...this.messages, message];
              setTimeout(() => {
                console.log('scroll')
                document.querySelector(`.message-thread`).scrollTop = document.querySelector(`.message-thread`).scrollHeight + 9999999999999;
              }, 100);
          }
          },
          err =>  console.log('Could send message to server, reason: ', err)
        );
      }
    });
}

alignMessage(userId: string): boolean {
  return this.userId === userId ? false : true;
}

sendMessage(){
  if(jQuery(".message").val().length > 0){
    jQuery(".embed-submit-field button").addClass('activebtn');
  }else{
    jQuery(".embed-submit-field button").removeClass('activebtn');
  }
}
groupBy( array , f )
{
  var groups = {};
  array.forEach( function( o )
  {
    var group = JSON.stringify( f(o) );
    groups[group] = groups[group] || [];
    groups[group].push( o );  
  });
  return Object.keys(groups).map( function( group )
  {
    return groups[group]; 
  })
}
}
