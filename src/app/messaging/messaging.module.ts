import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagingRoutingModule } from './messaging-routing.module';
import { MessagingComponent } from './messaging.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ConversationComponent } from './conversation/conversation.component';
import { ReactiveFormsModule ,FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MessagingRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [MessagingComponent, ChatListComponent, ConversationComponent]
})
export class MessagingModule { }