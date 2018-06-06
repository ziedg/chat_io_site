import { Component, OnInit, Input } from '@angular/core';
import { EmitterService } from '../emitter.service';
import { User } from '../../beans/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketService } from '../../main/services/socket.service';

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
    private socketService :SocketService
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
      if(data.messages==undefined)
      {
        this.messages=[];
      }
      else{
        this.messages = data.messages;

      }
  });
}

sendMessage(event) {
  if (event.keyCode === 13) {
      const message = this.messageForm.controls['message'].value.trim();
      console.log(message);
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
          this.socketService.sendMessage({
              fromUserId: this.userId,
              message: (message).trim(),
              toUserId: this.selectedUser._id
          });
          this.messageForm.reset();
          setTimeout(() => {
              document.querySelector(`.message-thread`).scrollTop = document.querySelector(`.message-thread`).scrollHeight;
          }, 100);
      }
  }
}

listenForMessages(userId: string): void {
  this.userId = userId;
  this.socketService.receiveMessages()
  .subscribe((message) => {
    /* subscribing for messages statrts */
    if (this.selectedUser !== null && this.selectedUser._id === message.fromUserId) {
      this.messages = [...this.messages, message];
      setTimeout(() => {
        document.querySelector(`.message-thread`).scrollTop = document.querySelector(`.message-thread`).scrollHeight;
      }, 100);
    }
  });
}

alignMessage(userId: string): boolean {
  return this.userId === userId ? false : true;
}


}
