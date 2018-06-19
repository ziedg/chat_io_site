import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../../beans/user';
import { ChatService } from '../../messanging/chat.service';
import { EmitterService } from '../emitter.service';

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
export class ConversationComponent  {
  @Input() conversation: string;
  @Input() selectedUserInfo: string;
  public selectedUser: User = null;
	public messageForm: FormGroup;
	private userId: string = null;

  public messages = [];
  public messageLoading = true;

  constructor(private emitterService:EmitterService,
    private router:Router,
    private chatService: ChatService
  ) { 
		this.messageForm =new FormBuilder().group({
			message: new MessageValidation
		});;
    
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

sendMessage(event) {
  if (event.keyCode === 13) {
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
  }
}

listenForMessages(userId: string): void {
  this.userId = userId;
  
}

alignMessage(userId: string): boolean {
  return this.userId === userId ? false : true;
}


}
