import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagingRoutingModule } from './messaging-routing.module';
import { MessagingComponent } from './messaging.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ConversationComponent } from './conversation/conversation.component';
import { ReactiveFormsModule ,FormsModule } from '@angular/forms';
import { ChatListItemComponent } from './chat-list-item/chat-list-item.component';
import { HeaderMobileComponent } from './header-mobile/header-mobile.component';
import { ConversationMobileComponent } from './conversation-mobile/conversation-mobile.component';

@NgModule({
  imports: [
    CommonModule,
    MessagingRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [MessagingComponent, ChatListComponent, ConversationComponent, ChatListItemComponent, HeaderMobileComponent, ConversationMobileComponent]
})
export class MessagingModule { }
