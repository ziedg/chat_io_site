import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';

import { User } from '../../beans/user';
import { ChatService } from '../../messanging/chat.service';
import { LoginService } from '../../login/services/loginService';
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
  selector: 'app-conversation-mobile',
  templateUrl: './conversation-mobile.component.html',
  styleUrls: ['./conversation-mobile.component.css']
})
export class ConversationMobileComponent implements OnInit {
  firstListen: boolean = true;
  @Input() conversation: string;
  @Input() selectedUserInfo: string;
  //data: any ="Initializeeed";
  public selectedUser: User = null;
  public messageForm: FormGroup;
  private userId: string = null;
  private user: User = null;
  public messages = [];
  public messageLoading = false;
  private s: AngularFireObject<any>;
  loaded: Boolean = false;

  constructor(private emitterService: EmitterService,
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private db: AngularFireDatabase,
    private chatService: ChatService
  ) {
    this.user = this.loginService.getUser();
    this.userId = this.user._id;

    this.selectedUser = this.emitterService.getSelectedUser();
    // with the Resolver
    // this.data = this.route.snapshot.data;
    // let allMessages = this.data.messages;
    // if(allMessages==undefined)
    //   {
    //     this.messages=[];
    //   }
    //   else{
    //     this.messages = allMessages;
    //     console.log(this.messages);
    //   }
    //   this.messageLoading = true;
    // Without the Resolver
    this.emitterService.conversationEmitter.subscribe((data) => {
      if (data == undefined) {
        this.messages = [];
      }
      else {
        this.loaded = true;
        this.messages = data;
        console.log(this.messages);
      }
      this.messageLoading = true;

    });


    jQuery(".message-wrapper").animate({ scrollTop: jQuery('.message-thread').prop("scrollHeight") }, 500);
    this.messageForm = new FormBuilder().group({
      message: new MessageValidation
    });

    jQuery(".navigation-bottom").addClass('hidden-xs');
  }

  ngOnInit() {
    this.listenForMessages(this.userId);
  }

  sendMessage() {
    if (jQuery(".message").val().length > 0) {
      jQuery(".embed-submit-field button").addClass('activebtn');
    } else {
      jQuery(".embed-submit-field button").removeClass('activebtn');
    }
  }

  sendHome() {
    this.router.navigate(['/main/messaging']);
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
      this.messages = [...this.messages, data];
      /* calling method to send the messages */
      this.chatService.sendMessage(data).subscribe(
        () => console.log('Sent Message server.'),
        err => console.log('Could send message to server, reason: ', err));

      this.messageForm.reset();
      setTimeout(() => {
        document.querySelector(`.message-thread`).scrollTop = document.querySelector(`.message-thread`).scrollHeight;
      }, 100);
    }
    //}
  }

  listenForMessages(userId: string): void {
    console.log("mobiiiile listen");
    this.userId = userId;
    this.s = this.db.object('notifications/' + this.userId + '/messaging');
    console.log('notifications/' + this.userId + '/messaging');
    var item = this.s.valueChanges()
    console.log(JSON.stringify(item));
    this.s.snapshotChanges().subscribe(action => {
      var notif = action.payload.val();
      if (notif !== null) {
        this.chatService.getMessage(notif.msgId).subscribe(
          message => {
            if (!this.firstListen && this.selectedUser !== null && this.selectedUser._id === notif.senderId) {
              this.messages = [...this.messages, message];
              console.log(this.messages);
              setTimeout(() => {
                console.log(document.querySelector(`.message-thread`))
                document.querySelector(`.message-thread`).scrollTop = document.querySelector(`.message-thread`).scrollHeight + 9999999999999;
              }, 100);
            }
            this.firstListen = false;
          },
          err => console.log('Could send message to server, reason: ', err)
        );
      }
    });
  }

  alignMessage(userId: string): boolean {
    return this.userId === userId ? false : true;
  }

  lastMessage(message: any): boolean {
    let i = this.messages.indexOf(message);
    if (this.messages[i + 1] !== null && this.messages[i + 1] !== undefined) {
      if (this.messages[i + 1].fromUserId == message.fromUserId) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }

  }
}