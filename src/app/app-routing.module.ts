import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Logout } from './logout/logout';
import { NotFoundPage } from './main/components/404/404';
import { Home } from './main/components/home/home';
import { Main } from './main/components/main';
import { Notification } from './main/components/notification/notification';
import { Post } from './main/components/post/post';
import { Profile } from './main/components/profile/profile';
import { SuggestionsComponent } from './main/components/suggestions/suggestions.component';
import { FakeComponent } from './shared/fake.component';
import { MessagingComponent } from './messaging/messaging.component';
import {SearchMobile} from "./main/components/search-mobile/search-mobile.component";
import {ConversationMobileComponent} from './messaging/conversation-mobile/conversation-mobile.component';
// import { ProfileResolver } from './main/components/profile/profile.resolver';
// import { PublicationResolver } from './main/components/profile/publication.resolver';
//import { MessageResolver } from './messaging/conversation-mobile/messages.resolver';

export const routes: Routes = [
    {path: 'redirect', component: FakeComponent},
    {
        path: '',
        redirectTo: '/main/home',
        pathMatch: 'full'
        //terminal: true
    },
    { path: 'login', loadChildren: './login/login.module#LoginModule'},

    {
        path: 'main',
        component: Main,
        children: [
            {path: '', redirectTo: 'home', pathMatch: 'full'},
            {path: 'home', component: Home },
            {path: 'profile/:id', component: Profile/*, resolve: { publication: PublicationResolver, profile: ProfileResolver  }*/},
            {
                path: 'parameters', loadChildren: './main/parameters/parameters.module#ProfileParametersModule'
            },
						{path: 'suggestions', component: SuggestionsComponent},
            {path: 'search-mobile', component: SearchMobile},
            {path: 'post/:id', component: Post},
            {path: 'notification', component: Notification},
            {path: '404', component: NotFoundPage},
            {path: 'messaging',component: MessagingComponent },
            {path: 'mobile/:stringid', component: ConversationMobileComponent /*, resolve: {messages: MessageResolver}*/},
            {path: '**', redirectTo: '404'}
        ]
    },
     {
        path: 'logout',
        component: Logout
    },

    {
        path: 'support',
        loadChildren: './support/support.module#SupportModule'

    },
   
    {
        path: '**',
        redirectTo: '/main/404'
    }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    //ProfileResolver,
    //PublicationResolver,
    /*MessageResolver*/
  ]
})
export class AppRoutingModule {}
